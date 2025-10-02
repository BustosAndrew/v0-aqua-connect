# src/price_features.py
import argparse
from pathlib import Path
import numpy as np
import pandas as pd
import unicodedata as ud
import re

def _norm(s: str) -> str:
    # normalize: lowercase, no accents, spaces/dashes -> underscores
    s = "".join(c for c in ud.normalize("NFKD", s) if not ud.combining(c))
    return s.strip().lower().replace(" ", "_").replace("-", "_")

def _read_flex(path: Path) -> pd.DataFrame:
    # sep=None lets pandas sniff commas/semicolons/tabs; utf-8-sig handles BOM
    return pd.read_csv(path, sep=None, engine="python", encoding="utf-8-sig")

def _first(cols, candidates):
    for c in candidates:
        if c in cols:
            return c
    return None

def _is_iso_week_strings(series: pd.Series) -> bool:
    s = series.astype(str)
    # exact ISO like 2024-W30
    return s.str.match(r"^\d{4}-W\d{2}$").all()

def ensure_week(df: pd.DataFrame) -> pd.DataFrame:
    cols = set(df.columns)
    # 1) already has 'week'
    if "week" in cols:
        # if it's already ISO 'YYYY-Www', keep as-is; don't try to parse
        if _is_iso_week_strings(df["week"]):
            return df
        # if it's date-like, convert to ISO week
        try:
            d = pd.to_datetime(df["week"], errors="coerce")
            mask = d.notna()
            if mask.any():
                iso = d.dt.isocalendar()
                df.loc[mask, "week"] = [f"{y}-W{w:02d}" for y, w in zip(iso.year, iso.week)]
        except Exception:
            pass
        return df

    # 2) target_week present
    if "target_week" in cols:
        df["week"] = df["target_week"]
        return df

    # 3) date/fecha present
    dcol = _first(cols, ["fecha", "date", "week_date", "fecha_semana"])
    if dcol:
        d = pd.to_datetime(df[dcol], errors="coerce")
        iso = d.dt.isocalendar()
        df["week"] = [f"{y}-W{w:02d}" for y, w in zip(iso.year, iso.week)]
        return df

    # 4) year + semana/weeknum present
    ycol = _first(cols, ["year", "anio", "ano"])
    wcol = _first(cols, ["semana", "semana_num", "week_num", "weeknumber", "weekn"])
    if ycol and wcol:
        df["week"] = df.apply(lambda r: f"{int(r[ycol])}-W{int(r[wcol]):02d}", axis=1)
        return df

    raise SystemExit("Could not determine 'week'. Provide one of: week | target_week | fecha/date | year+semana.")

def week_to_date(week_str: str) -> pd.Timestamp:
    # Monday of ISO week
    return pd.to_datetime(str(week_str) + "-1", format="%G-W%V-%u")

def add_lags(df: pd.DataFrame, col: str, by="port", lags=(1,2,4,8)) -> pd.DataFrame:
    g = df.sort_values([by, "week_dt"]).copy()
    for L in lags:
        g[f"{col}_lag{L}"] = g.groupby(by)[col].shift(L)
    return g

def add_rolls(df: pd.DataFrame, col: str, by="port", win=4) -> pd.DataFrame:
    g = df.sort_values([by, "week_dt"]).copy()
    g[f"{col}_rollmean{win}"] = g.groupby(by)[col].shift(1).rolling(win).mean().reset_index(level=0, drop=True)
    g[f"{col}_rollstd{win}"]  = g.groupby(by)[col].shift(1).rolling(win).std().reset_index(level=0, drop=True)
    return g

def build_features(price_csv: Path, land_csv: Path, pred_csv: Path|None, out_path: Path) -> pd.DataFrame:
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # Load and normalize column names
    price = _read_flex(price_csv); price.columns = [_norm(c) for c in price.columns]
    land  = _read_flex(land_csv);  land.columns  = [_norm(c) for c in land.columns]
    pred = None
    if pred_csv and Path(pred_csv).exists():
        pred = _read_flex(pred_csv); pred.columns = [_norm(c) for c in pred.columns]

    # Map common synonyms -> canonical names
    price = price.rename(columns={
        _first(price.columns, ["puerto","port_name","harbor"]) or "port": "port",
        _first(price.columns, ["precio_pen_kg","precio_pen","precio","price"]) or "price_pen_perkg": "price_pen_perkg",
    })
    price = ensure_week(price)

    land = land.rename(columns={
        _first(land.columns, ["puerto","port_name","harbor"]) or "port": "port",
        _first(land.columns, ["desembarques_ton","capturas_ton","toneladas","landings"]) or "landings_tons": "landings_tons",
    })
    land = ensure_week(land)

    # predicted landings t+1 (optional)
    if pred is not None:
        pred = pred.rename(columns={
            _first(pred.columns, ["puerto","port_name","harbor"]) or "port": "port",
        })
        pred = ensure_week(pred)
        if "pred_landings_t1" not in pred.columns:
            if "landings_tons" in pred.columns:
                pred = pred.sort_values(["port","week"])
                pred["pred_landings_t1"] = pred.groupby("port")["landings_tons"].shift(-1)
            else:
                pred["pred_landings_t1"] = np.nan
        pred = pred[["week","port","pred_landings_t1"]]
    else:
        tmp = land.sort_values(["port","week"]).copy()
        tmp["pred_landings_t1"] = tmp.groupby("port")["landings_tons"].shift(-1)
        pred = tmp[["week","port","pred_landings_t1"]]

    # Keep only needed columns and merge
    price = price[["week","port","price_pen_perkg"]].copy()
    land  = land[["week","port","landings_tons"]].copy()

    df = price.merge(land, on=["week","port"], how="left").merge(pred, on=["week","port"], how="left")

    # 🔧 Create a single week_dt AFTER merge (avoid week_dt_x/week_dt_y)
    df["week_dt"] = df["week"].apply(week_to_date)

    df = df.sort_values(["port","week_dt"]).reset_index(drop=True)

    # Feature engineering
    df = df.groupby("port", group_keys=False).apply(add_lags, col="price_pen_perkg", lags=[1,2,4,8])
    df = df.groupby("port", group_keys=False).apply(add_lags, col="landings_tons", lags=[1,2,4])
    df = df.groupby("port", group_keys=False).apply(add_rolls, col="price_pen_perkg", win=4)

    wk = df["week_dt"].dt.isocalendar().week.astype(int)
    df["woy_sin"] = np.sin(2*np.pi*wk/52.0)
    df["woy_cos"] = np.cos(2*np.pi*wk/52.0)
    df["month"]   = df["week_dt"].dt.month

    df["price_next"] = df.groupby("port")["price_pen_perkg"].shift(-1)

    features = [
        "price_pen_perkg_lag1","price_pen_perkg_lag2","price_pen_perkg_lag4","price_pen_perkg_lag8",
        "price_pen_perkg_rollmean4","price_pen_perkg_rollstd4",
        "landings_tons_lag1","landings_tons_lag2","landings_tons_lag4",
        "pred_landings_t1","woy_sin","woy_cos","month"
    ]
    model_df = df.dropna(subset=features + ["price_next"]).reset_index(drop=True)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    model_df.to_csv(out_path, index=False)
    print(f"Wrote features -> {out_path}  rows={len(model_df)}")
    return model_df

def main():
    ap = argparse.ArgumentParser("Build weekly price features")
    ap.add_argument("--species", default="anchoveta")
    ap.add_argument("--price_csv", default="data/price/anchoveta_prices.csv")
    ap.add_argument("--land_csv",  default="data/landings/anchoveta_landings.csv")
    ap.add_argument("--pred_csv",  default="data/landings/predicted_landings.csv")
    ap.add_argument("--out",       default="data/processed/anchoveta_price_features.csv")
    args = ap.parse_args()
    build_features(Path(args.price_csv), Path(args.land_csv), Path(args.pred_csv), Path(args.out))

if __name__ == "__main__":
    main()
