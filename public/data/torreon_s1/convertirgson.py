import rasterio
import geopandas as gpd
from shapely.geometry import Point
import numpy as np

# Abrir el TIF
tif_path = "OPERA_L3_DSWx-S1_T13RFJ_20250914T124917Z_20250914T195804Z_S1A_30_v1.0_B01_WTR.tif"
dataset = rasterio.open(tif_path)

# Leer las 3 bandas (RGB)
red = dataset.read(1)
green = dataset.read(2)
blue = dataset.read(3)

# Detectar píxeles verdes (más verde que rojo y azul)
mask = (green > red) & (green > blue) & (green > 50)  # 50 es un umbral para evitar ruido

# Coordenadas de los píxeles verdes
rows, cols = np.where(mask)

points = []
for row, col in zip(rows, cols):
    x, y = dataset.transform * (col, row)
    points.append(Point(x, y))

# Crear GeoDataFrame
gdf = gpd.GeoDataFrame(geometry=points, crs=dataset.crs)

# Guardar como GeoJSON
gdf.to_file("puntos_verdes_detectados.geojson", driver="GeoJSON")
