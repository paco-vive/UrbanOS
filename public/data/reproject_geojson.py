import json
import math

def mercator_to_latlon(x, y):
    lon = (x / 20037508.34) * 180
    lat = math.degrees(2 * math.atan(math.exp(y / 20037508.34 * math.pi)) - math.pi / 2)
    return [lon, lat]  # Return as [lng, lat] for GeoJSON

def reproject_geometry(geometry):
    if geometry['type'] == 'Polygon':
        for ring in geometry['coordinates']:
            for i in range(len(ring)):
                ring[i] = mercator_to_latlon(ring[i][0], ring[i][1])
    # Add support for other geometry types if needed (e.g., MultiPolygon)
    return geometry

# Load the original GeoJSON
with open('public/data/torreon_clip.json', 'r') as f:
    data = json.load(f)

# Reproject each feature
for feature in data['features']:
    feature['geometry'] = reproject_geometry(feature['geometry'])

# Add optional properties if missing (your code uses them in popups)
for feature in data['features']:
    if 'NOM_MUN' not in feature['properties']:
        feature['properties']['NOM_MUN'] = 'Unknown Municipality'  # Placeholder
    if 'source' not in feature['properties']:
        feature['properties']['source'] = 'Converted GeoJSON'

# Save the fixed GeoJSON
with open('public/data/torreon_clip_fixed2.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Conversion complete. Use 'torreon_clip_fixed2.json' in your code.")