"""Synthetic weekly SST/Chl features + hotspot labels for demo.
This lets you run end-to-end without external data.
"""
import numpy as np
import pandas as pd
from datetime import date, timedelta
from src.grid import coastal_grid
from src.features import build_weekly_features

from pathlib import Path
Path("data/processed").mkdir(parents=True, exist_ok=True)


FEATURES_OUT = "data/processed/features.parquet"
LABELS_OUT   = "data/processed/labels.parquet"

def iso_weeks(start="2024-05-01", end="2024-10-01"):
    d0 = pd.to_datetime(start).date()
    d1 = pd.to_datetime(end).date()
    # Mondays only
    cur = d0 - timedelta(days=d0.weekday())
    weeks = []
    while cur <= d1:
        weeks.append(f"{cur.isocalendar().year}-W{cur.isocalendar().week:02d}")
        cur += timedelta(days=7)
    return sorted(list(dict.fromkeys(weeks)))

def synth_env(grid_df: pd.DataFrame, weeks: list[int]) -> tuple[pd.DataFrame, pd.DataFrame]:
    """Create synthetic SST and Chl fields varying by lat/lon and season."""
    rows_sst, rows_chl = [], []
    for w in weeks:
        # seasonal driver: warmest around W30
        wknum = int(w.split("-W")[1])
        season = np.cos((wknum-30)/12.0)  # rough seasonal variation
        for la, lo in zip(grid_df["lat"].values, grid_df["lon"].values):
            # Base fields: SST colder in south, warmer in north; offshore slightly warmer
            sst = 16.0 + 0.25*(la + 18) + 0.4*(lo + 82) + 1.5*season + np.random.normal(0, 0.4)
            # Chlorophyll: higher near coast (smaller lon), higher in south (upwelling proxy)
            chl = 1.5 + 0.05*(18 + la) + 0.15*( - (lo + 82)) + 0.3*(-season) + np.random.normal(0, 0.1)
            rows_sst.append((w, la, lo, float(sst)))
            rows_chl.append((w, la, lo, max(0.01, float(chl))))
    sst_df = pd.DataFrame(rows_sst, columns=["week","lat","lon","value"])
    chl_df = pd.DataFrame(rows_chl, columns=["week","lat","lon","value"])
    return sst_df, chl_df

def synth_labels(feats: pd.DataFrame) -> pd.DataFrame:
    """Create synthetic hotspot labels: fish prefer SST ~18-21C, Chl ~1.0-2.0, positive anomaly."""
    df = feats.copy()
    # A smooth suitability function
    sst_pref = np.exp(-((df["sst"] - 19.5)/2.0)**2)
    chl_pref = np.exp(-((df["chl"] - 1.4)/0.6)**2)
    anom_boost = 0.5 * (df["sst_anom"] > 0).astype(float)
    raw = 0.5*sst_pref + 0.4*chl_pref + 0.1*anom_boost + 0.05*np.random.rand(len(df))
    # Threshold top 30% per week as hotspots
    labels = []
    for w, g in df.groupby("week"):
        thr = np.quantile(raw[g.index], 0.7)
        hot = (raw[g.index] >= thr).astype(int)
        labels.append(pd.DataFrame({
            "week": g["week"].values,
            "lat": g["lat"].values,
            "lon": g["lon"].values,
            "hotspot": hot
        }))
    labels_df = pd.concat(labels, ignore_index=True)
    return labels_df

def main():
    grid = coastal_grid(step=0.5)  # coarser grid for demo speed
    weeks = iso_weeks("2024-05-01", "2024-10-01")
    sst_df, chl_df = synth_env(grid, weeks)
    feats = build_weekly_features(sst_df, chl_df)
    feats.to_parquet(FEATURES_OUT, index=False)
    labels = synth_labels(feats)
    labels.to_parquet(LABELS_OUT, index=False)
    print(f"Wrote features -> {FEATURES_OUT}  rows={len(feats)}")
    print(f"Wrote labels   -> {LABELS_OUT}  rows={len(labels)}")

if __name__ == "__main__":
    main()
