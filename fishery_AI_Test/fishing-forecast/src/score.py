import numpy as np
import pandas as pd
import joblib

def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    p1 = np.radians(lat1)
    p2 = np.radians(lat2)
    dlat = p2 - p1
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat/2.0)**2 + np.cos(p1)*np.cos(p2)*np.sin(dlon/2.0)**2
    return 2*R*np.arcsin(np.sqrt(a))

def score_week(model_path: str, weekly_features: pd.DataFrame,
               port_lat: float, port_lon: float, lam: float=0.02) -> pd.DataFrame:
    """Load model and compute Top-10 cells using distance-aware score.
    weekly_features must contain: sst, chl, sst_anom, month, lat, lon.
    Returns DataFrame with [lat, lon, p, dist_km, score].
    """
    model = joblib.load(model_path)
    feats = ["sst","chl","sst_anom","month"]
    df = weekly_features.dropna(subset=feats).copy()
    if df.empty:
        return df
    proba = model.predict_proba(df[feats].values)[:,1]
    df["p"] = proba
    df["dist_km"] = haversine_km(port_lat, port_lon, df["lat"].values, df["lon"].values)
    df["score"] = df["p"] - lam * df["dist_km"]
    return df.sort_values("score", ascending=False).head(10)[["lat","lon","p","dist_km","score"]]
