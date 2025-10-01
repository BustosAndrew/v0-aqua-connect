# Artisanal Fishing Hotspot AI (MVP)

A minimal, hackathon-friendly system that predicts **weekly fishing hotspots** for artisanal fleets along the Peruvian coast using **Sea Surface Temperature (SST)** and **Chlorophyll-a (Chl-a)**. It trains an **XGBoost classifier** to predict hotspot probability per coastal grid cell and produces a **distance-aware Top-10** recommendation per port. Includes a **Streamlit** app to visualize results.

## Features
- Weekly coastal grid (lat/lon)
- Features: SST, Chl, SST anomaly, month (extensible: gradients, currents)
- Labels: synthetic hotspot (for demo) or plug-in real BI/landing data
- Model: XGBoost hotspot classifier
- Scoring: probability minus distance penalty from chosen port
- UI: Streamlit map + Top-10 cells per port

## Quickstart (with synthetic data)
1) Create a virtual environment and install requirements:
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2) Generate synthetic data and train:
```bash
python src/data_gen.py      # creates weekly features + labels
python src/train.py         # trains the XGBoost model
```

3) Run the demo app:
```bash
streamlit run app/App.py
```

4) In the UI, pick a **port** and an **ISO week** (e.g., `2024-W30`).

## Using your real data
- Export weekly landings/CPUE by port/species from your BI system.
- Convert to labels per (week, grid cell), e.g. hotspot=1 for top-quantile cells.
- Save labels to `data/processed/labels.parquet` with columns:
  - `week` (ISO week string, e.g., `2024-W30`)
  - `lat`, `lon` (grid cell center in decimal degrees)
  - `hotspot` (0/1)
- Re-run `python src/train.py` to train on real labels.

## Repo layout
```
/data
  /raw           # put raw rasters or BI extracts here
  /processed     # weekly features parquet and labels
/models          # saved model(s)
/app             # streamlit demo
/src             # source code
/notebooks       # for EDA
```

## Notes
- This is an **MVP scaffold** geared for a 1–1.5 week hackathon. Extend with currents, SSH, fronts, bathymetry, and proper CPUE later.
- For forecasts: feed next-week SST/Chl (persistence or forecasts) into `score.py` pipeline.
- Use multiple species by training one model per species and adding a dropdown in the app.
