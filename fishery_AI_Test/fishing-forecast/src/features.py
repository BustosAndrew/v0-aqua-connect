import pandas as pd
import numpy as np

def _iso_week_to_month(week_str: str) -> int:
    # Convert ISO week like '2024-W30' to a representative date -> month
    # We pick Monday of that ISO week.
    return pd.to_datetime(week_str + "-1", format="%G-W%V-%u").month

def build_weekly_features(sst_df: pd.DataFrame, chl_df: pd.DataFrame) -> pd.DataFrame:
    """Combine SST and Chl to a weekly feature table.
    Inputs require columns: [week, lat, lon, value].
    Returns columns: [week, lat, lon, sst, chl, sst_anom, month].
    """
    sst = sst_df.rename(columns={"value":"sst"})
    chl = chl_df.rename(columns={"value":"chl"})
    df = sst.merge(chl, on=["week","lat","lon"], how="inner")
    # Month from ISO week
    df["month"] = df["week"].apply(_iso_week_to_month)
    # SST anomaly: subtract 8-week rolling mean per cell
    df = df.sort_values(["lat","lon","week"]).reset_index(drop=True)
    df["week_dt"] = pd.to_datetime(df["week"] + "-1", format="%G-W%V-%u")
    df["sst_anom"] = (df
        .groupby(["lat","lon"], group_keys=False)
        .apply(lambda g: g.assign(sst_anom=g["sst"] - g["sst"].rolling(window=8, min_periods=1).mean()))
        ["sst_anom"]
    )
    # Clean up
    df = df.drop(columns=["week_dt"]).dropna(subset=["sst","chl"]).reset_index(drop=True)
    return df[["week","lat","lon","sst","chl","sst_anom","month"]]
