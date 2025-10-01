import pandas as pd
from sklearn.model_selection import TimeSeriesSplit
from xgboost import XGBClassifier
import joblib
import os

FEATURES_PATH = "data/processed/features.parquet"
LABELS_PATH   = "data/processed/labels.parquet"
MODEL_PATH    = "models/hotspot_xgb.pkl"

def train_hotspot(features_df: pd.DataFrame, labels_df: pd.DataFrame, save_to: str=MODEL_PATH):
    df = features_df.merge(labels_df, on=["week","lat","lon"], how="inner").dropna()
    feats = ["sst","chl","sst_anom","month"]
    X = df[feats].values
    y = df["hotspot"].values
    model = XGBClassifier(
        n_estimators=400,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.9,
        reg_lambda=1.0,
        objective="binary:logistic",
        n_jobs=4
    )
    # For hackathon speed: fit once. (Optionally add TimeSeriesSplit CV)
    model.fit(X, y)
    import os
    os.makedirs(os.path.dirname(save_to), exist_ok=True)
    joblib.dump(model, save_to)
    print(f"Saved model to {save_to}")
    return model

def main():
    if not os.path.exists(FEATURES_PATH) or not os.path.exists(LABELS_PATH):
        raise FileNotFoundError("Missing features or labels parquet. Run data_gen.py first or provide real data.")
    feats = pd.read_parquet(FEATURES_PATH)
    labels = pd.read_parquet(LABELS_PATH)
    train_hotspot(feats, labels)

if __name__ == "__main__":
    main()
