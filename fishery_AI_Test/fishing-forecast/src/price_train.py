# src/price_train.py
import argparse, os, json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error
import joblib

def train_and_forecast(features_csv: Path, species: str,
                       model_dir: Path, out_dir: Path,
                       publish_dir: Path|None = None):
    model_dir.mkdir(parents=True, exist_ok=True)
    out_dir.mkdir(parents=True, exist_ok=True)
    if publish_dir:
        publish_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(features_csv)
    features = [
        "price_pen_perkg_lag1","price_pen_perkg_lag2","price_pen_perkg_lag4","price_pen_perkg_lag8",
        "price_pen_perkg_rollmean4","price_pen_perkg_rollstd4",
        "landings_tons_lag1","landings_tons_lag2","landings_tons_lag4",
        "pred_landings_t1","woy_sin","woy_cos","month"
    ]
    X = df[features].values
    y = df["price_next"].values

    # time-ordered split (last 20% as holdout)
    split = int(len(df)*0.8)
    X_tr, X_te = X[:split], X[split:]
    y_tr, y_te = y[:split], y[split:]

    # Regressor for next-week price
    reg = RandomForestRegressor(n_estimators=500, max_depth=7, random_state=0)
    reg.fit(X_tr, y_tr)
    y_pred = reg.predict(X_te)
    mae = float(mean_absolute_error(y_te, y_pred))

    # Direction classifier (Up/Down vs current)
    curr = df["price_pen_perkg"].values
    dir_up = (y > curr).astype(int)
    clf = RandomForestClassifier(n_estimators=400, max_depth=7, random_state=0)
    clf.fit(X_tr, dir_up[:split])
    dir_pred = clf.predict(X_te)
    dir_acc = float((dir_pred == dir_up[split:]).mean())

    # Save models
    reg_path = model_dir / f"{species}_price_rf.pkl"
    cls_path = model_dir / f"{species}_price_dir_rf.pkl"
    joblib.dump(reg, reg_path)
    joblib.dump(clf, cls_path)
    print(f"Saved models -> {reg_path.name}, {cls_path.name}")

    # Forecast next week for each port (use the last available row per port)
    last_rows = df.groupby("port", as_index=False).tail(1).copy()
    pred_vals = reg.predict(last_rows[features].values)
    dir_vals  = clf.predict(last_rows[features].values)

    # Compute the target ISO week (last week + 1)
    def week_to_date(week_str: str) -> pd.Timestamp:
        return pd.to_datetime(week_str + "-1", format="%G-W%V-%u")
    last_week = last_rows["week"].iloc[0]
    target_week_dt = week_to_date(last_week) + pd.Timedelta(days=7)
    iso = target_week_dt.isocalendar()
    target_week = f"{iso.year}-W{iso.week:02d}"

    # Rough uncertainty: 1-sigma of validation residuals
    resid = y_te - y_pred
    sigma = float(np.std(resid)) if len(resid) > 1 else 0.15

    out = pd.DataFrame({
        "species": species.capitalize(),
        "port": last_rows["port"].values,
        "target_week": target_week,
        "price_pred_pen_perkg": np.round(pred_vals, 3),
        "direction": np.where(dir_vals==1, "Up", "Down"),
        "model_mae_val": round(mae, 3),
        "directional_acc_val": round(dir_acc, 3),
        "lower_1sd": np.round(pred_vals - sigma, 3),
        "upper_1sd": np.round(pred_vals + sigma, 3),
    }).sort_values("port")

    # Save outputs
    csv_path  = out_dir / f"{species}_price_forecast_{target_week}.csv"
    json_path = out_dir / f"{species}_price_forecast_{target_week}.json"
    out.to_csv(csv_path, index=False)
    out.to_json(json_path, orient="records", indent=2)
    print(f"Wrote -> {csv_path.name} and {json_path.name}")

    # Optional: publish JSON to Next.js public/prices
    if publish_dir:
        pub_json = publish_dir / f"{species}_price_forecast_{target_week}.json"
        out.to_json(pub_json, orient="records", indent=2)
        print(f"Published to Next public -> {pub_json}")

    return out

def main():
    ap = argparse.ArgumentParser("Train price model and export next-week forecast")
    ap.add_argument("--species", default="anchoveta")
    ap.add_argument("--features_csv", default="data/processed/anchoveta_price_features.csv")
    ap.add_argument("--model_dir",    default="models")
    ap.add_argument("--out_dir",      default="outputs")
    ap.add_argument("--publish",      default="", help="Optional path to Next.js public/prices")
    args = ap.parse_args()

    publish_dir = Path(args.publish) if args.publish else None
    train_and_forecast(Path(args.features_csv),
                       species=args.species,
                       model_dir=Path(args.model_dir),
                       out_dir=Path(args.out_dir),
                       publish_dir=publish_dir)

if __name__ == "__main__":
    main()
