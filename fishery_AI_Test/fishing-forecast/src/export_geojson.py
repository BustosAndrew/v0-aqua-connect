# src/export_geojson.py
import os
import json
import argparse
from pathlib import Path

import numpy as np
import pandas as pd
import joblib

FEATURES_PATH = "data/processed/features.parquet"
MODEL_PATH = "models/hotspot_xgb.pkl"

# Approx coastline (lon at given lats) for a quick land mask
_LATS = np.array([-18.0, -15.0, -12.0, -9.0, -6.0, -3.0])
_LONS = np.array([-72.5, -75.0, -77.2, -78.5, -80.0, -80.9])

def df_to_fc(df: pd.DataFrame) -> dict:
    feats = []
    for _, r in df.iterrows():
        feats.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [float(r["lon"]), float(r["lat"])]},
            "properties": {"p": float(r["p"])}
        })
    return {"type": "FeatureCollection", "features": feats}

def export_week(week: str, out_dir: str):
    feats = pd.read_parquet(FEATURES_PATH)
    model = joblib.load(MODEL_PATH)

    dfw = feats[feats["week"] == week].copy()
    if dfw.empty:
        raise SystemExit(f"No features for {week}. Try one between your generated range (e.g., 2024-W19 .. 2024-W40).")

    # land mask: keep ocean-side only
    cut = np.interp(dfw["lat"].to_numpy(), _LATS, _LONS)
    dfw = dfw[dfw["lon"].to_numpy() < cut].copy()
    if dfw.empty:
        raise SystemExit("All cells masked as land—adjust the coastline arrays if needed.")

    # predict p
    dfw["p"] = model.predict_proba(dfw[["sst", "chl", "sst_anom", "month"]])[:, 1].clip(0, 1)

    # write GeoJSON
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    out_path = Path(out_dir) / f"{week}.geojson"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(df_to_fc(dfw), f)
    print(f"Wrote {out_path}  (features: {len(dfw)})")

def main():
    ap = argparse.ArgumentParser(description="Export weekly predictions to GeoJSON for Next.js public/predictions.")
    ap.add_argument("--week", help="ISO week like 2024-W30")
    ap.add_argument("--weeks", help="Comma-separated ISO weeks (e.g. 2024-W30,2024-W31)")
    ap.add_argument("--out", required=True, help="Output folder (e.g., ../your-next-app/public/predictions)")
    args = ap.parse_args()

    if not args.week and not args.weeks:
        raise SystemExit("Provide --week or --weeks")

    weeks = []
    if args.week:
        weeks.append(args.week)
    if args.weeks:
        weeks.extend([w.strip() for w in args.weeks.split(",") if w.strip()])

    for w in weeks:
        export_week(w, args.out)

if __name__ == "__main__":
    main()
