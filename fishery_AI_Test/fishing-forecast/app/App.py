import streamlit as st
import pandas as pd
import numpy as np
import pydeck as pdk
from src.score import score_week
import joblib

st.set_page_config(page_title="Artisanal Fishing Hotspots", layout="wide")

st.title("Artisanal Fishing Hotspots (Weekly)")
st.caption("Demo MVP: XGBoost hotspot predictions using SST + Chl (synthetic data). Replace with real BI and satellite feeds for production.")

# Port presets (approx coords)
PORTS = {
    "Paita": (-5.09, -81.11),
    "Chimbote": (-9.07, -78.59),
    "Callao": (-12.06, -77.15),
    "Pisco": (-13.71, -76.22),
    "Matarani": (-17.00, -72.10),
}

col1, col2, col3 = st.columns([1.2,1,1])
with col1:
    port = st.selectbox("Port", list(PORTS.keys()), index=2)
with col2:
    week = st.text_input("ISO Week (e.g., 2024-W30)", value="2024-W30")
with col3:
    lam = st.slider("Distance penalty (λ)", 0.0, 0.1, 0.02, 0.01)

# Load features and model
try:
    feats = pd.read_parquet("data/processed/features.parquet")
except Exception:
    st.error("Features parquet not found. Run data_gen.py first.")
    st.stop()

model_path = "models/hotspot_xgb.pkl"

# --- Build df for the selected week ---
dfw = feats[feats["week"] == week].copy()
if dfw.empty:
    st.warning("No data for that ISO week. Try a week between 2024-W19 and 2024-W40 (synthetic range).")
    st.stop()

# --- Lat-aware coastline cutoff (drop land points) ---
_lats = np.array([-18.0, -15.0, -12.0, -9.0, -6.0, -3.0])
_lons = np.array([-72.5, -75.0, -77.2, -78.5, -80.0, -80.9])  # approx coast
cut = np.interp(dfw["lat"].to_numpy(), _lats, _lons)
dfw = dfw[dfw["lon"].to_numpy() < cut].copy()
if dfw.empty:
    st.warning("All cells masked as land for this week. Loosen the cutoff.")
    st.stop()

# --- Top-10 (distance-aware) computed on the masked ocean cells ---
plat, plon = PORTS[port]
top10 = score_week(model_path, dfw, plat, plon, lam=lam)

# --- Per-cell probability for the heatmap ---
model = joblib.load(model_path)
dfw["p"] = model.predict_proba(dfw[["sst","chl","sst_anom","month"]])[:, 1]
dfw["p"] = dfw["p"].astype(float).fillna(0.0).clip(0.0, 1.0)

# --- Explicit color columns (deck.gl-friendly) ---
dfw["r"] = (255 * dfw["p"]).round().astype(int)
dfw["g"] = 50
dfw["b"] = (200 * (1.0 - dfw["p"])).round().astype(int)

st.subheader("Top-10 Recommended Cells (Distance-aware)")
st.dataframe(top10.style.format({"p":"{:.2f}","dist_km":"{:.1f}","score":"{:.2f}"}))

# --- Map ---
st.subheader("Hotspot Probability Map")

mid_lat = float(dfw["lat"].mean())
mid_lon = float((dfw["lon"].min() + dfw["lon"].max()) / 2)

layer = pdk.Layer(
    "ScatterplotLayer",
    data=dfw,
    get_position='[lon, lat]',
    get_fill_color='[r, g, b, 200]',  # <- use the columns we created
    get_line_color='[20,20,20,80]',
    stroked=True,
    pickable=True,
    get_radius=15000,
    opacity=0.9,
)

r = pdk.Deck(
    layers=[layer],
    initial_view_state=pdk.ViewState(latitude=mid_lat, longitude=mid_lon, zoom=5.3, pitch=0),
    tooltip={"text": "lat: {lat}\nlon: {lon}\np: {p}"},
)
st.pydeck_chart(r)

st.caption("Note: Colors scale with predicted hotspot probability p. Replace synthetic features with real SST/Chl and labels for production.")
