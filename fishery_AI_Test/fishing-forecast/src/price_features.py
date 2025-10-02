# src/price_features.py
import argparse
from pathlib import Path
import numpy as np
import pandas as pd

def week_to_date(week_str: str) -> pd.Timestamp:
    # Monday of ISO week
    return pd.to_datetime(week_str + "-1", format="%G-W%V-%u")

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

def build_features(price_csv: Path, land_csv: Path, pred_csv: Path|None,
                   out_path: Path) -> pd.DataFrame:
    out_path.parent.mkdir(parents=True, exist_ok=True)

    price = pd.read_csv(price_csv)
    land  = pd.read_csv(land_csv)
    price["week_dt"] = price["week"].apply(week_to_date)
    land["week_dt"]  = land["week"].apply(week_to_date)

    df = price.merge(land, on=["week","port"], how="left")

    if pred_csv and Path(pred_csv).exists():
        pred = pd.read_csv(pred_csv)
        df = df.merge(pred, on=["week","port"], how="left")
    else:
        # naive stand-in: next week landings ≈ this week landings
        tmp = land.sort_values(["port","week_dt"]).copy()
        tmp["pred_landings_t1"] = tmp.groupby("port")["landings_tons"].shift(-1)
        df = df.merge(tmp[["week","port","pred_landings_t1"]], on=["week","port"], how="left")

    df = df.sort_values(["port","week_dt"]).reset_index(drop=True)

    # Lags, rolling stats, seasonality
    df = add_lags(df, "price_pen_perkg", lags=(1,2,4,8))
    df = add_lags(df, "landings_tons", lags=(1,2,4))
    df = add_rolls(df, "price_pen_perkg", win=4)

    wk = df["week_dt"].dt.isocalendar().week.astype(int)
    df["woy_sin"] = np.sin(2*np.pi*wk/52.0)
    df["woy_cos"] = np.cos(2*np.pi*wk/52.0)
    df["month"]   = df["week_dt"].dt.month

    # Target = next week price
    df["price_next"] = df.groupby("port")["price_pen_perkg"].shift(-1)

    features = [
        "price_pen_perkg_lag1","price_pen_perkg_lag2","price_pen_perkg_lag4","price_pen_perkg_lag8",
        "price_pen_perkg_rollmean4","price_pen_perkg_rollstd4",
        "landings_tons_lag1","landings_tons_lag2","landings_tons_lag4",
        "pred_landings_t1","woy_sin","woy_cos","month"
    ]
    model_df = df.dropna(subset=features + ["price_next"]).reset_index(drop=True)
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
