import numpy as np
import pandas as pd

def coastal_grid(lat_min: float=-18.0, lat_max: float=-3.0,
                 lon_min: float=-86.0, lon_max: float=-70.0,   # was -84 to -70
                 step: float=0.25,
                 coast_lon_band=(-84.5, -72.0)) -> pd.DataFrame:   # was (-82.5, -72.0)
    """Create a coarse coastal grid for Peru.
    Returns DataFrame with columns [lat, lon].
    We restrict longitude to a coastal band for artisanal focus.
    """
    lats = np.arange(lat_min, lat_max + 1e-9, step)
    lons = np.arange(lon_min, lon_max + 1e-9, step)
    cells = []
    for la in lats:
        for lo in lons:
            if coast_lon_band[0] <= lo <= coast_lon_band[1]:
                cells.append((round(float(la), 6), round(float(lo), 6)))
    return pd.DataFrame(cells, columns=["lat", "lon"])
