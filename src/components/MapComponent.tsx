import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import Link from 'next/link';
import RecommendationModal from './RecommendationModal';


const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Neighborhood {
  id: number;
  name: string;
  coordinates: [number, number];
  vegetation: number;
}

interface Recommendation {
  description: string;
  type: 'park' | 'building' | 'infrastructure';
}

const mockData = {
  neighborhoods: [
    {
      id: 1,
      name: "",
      coordinates: [25.542, -103.406] as [number, number],
      vegetation: 8.4
    }
  ]
};

const priorityColors: Record<string, { bg: string; border: string; text: string }> = {
  high: { bg: '#fecaca', border: '#ef4444', text: '#991b1b' },
  medium: { bg: '#fed7aa', border: '#f59e0b', text: '#9a3412' },
  low: { bg: '#bbf7d0', border: '#10b981', text: '#14532d' }
};

const typeIcons: Record<string, string> = {
  park: '🌳',
  building: '🏢',
  infrastructure: '🏗️'


};


interface LeaderDataItem {
  org: string;
  contribution: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}


const leaderData: LeaderDataItem[] = [
  {
    org: 'IMPLAN Torreón (Plataforma SIG y PGT)',
    contribution: 'Provides geospatial data to map greenspaces and plan park development.',
  },
  {
    org: 'Ayuntamiento de Torreón',
    contribution: 'Integrates geospatial data with zoning to prioritize greenspace expansion.',
  },
  {
    org: 'SINAICA (INECC/SEMARNAT)',
    contribution: 'Air quality data to guide greenspace placement in polluted areas.',
  },
  {
    org: 'CONAGUA (SIGAGIS)',
    contribution: 'Water resource data for sustainable irrigation strategies.',
  },
  {
    org: 'MODIS LST (NASA)',
    contribution: 'Identifies urban heat islands for targeted greenspace creation.',
  },
  {
    org: 'Sentinel-5P (TROPOMI, NO₂)',
    contribution: 'Highlights high-pollution zones for park prioritization.',
  },
  {
    org: 'GRACE-FO',
    contribution: 'Supports sustainable greenspace planning with water storage data.',
  },
];


function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '0px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '650px',
          maxHeight: '80vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            zIndex: 10,
          }}
        >
          <h2 style={{
            fontSize: '1.35rem',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0,
          }}>
            City Leaders Involvement
          </h2>

          

          
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              color: '#6b7280',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

export  function LeaderButtonModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ display: 'relative', justifyContent: 'flex-end', margin: '16px 0' }}>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'absolute', 
          top: '100px',
          right: '20px',
          zIndex: 80,
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          color: '#ffffff',
          fontWeight: '500',
          padding: '9px 8px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.8rem',
          transition: 'all 0.3s ease',
          boxShadow: '0 6px 0 #1e40af, 0 8px 20px rgba(37, 99, 235, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 9px 0 #1e40af, 0 12px 28px rgba(37, 99, 235, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 0 #1e40af, 0 8px 20px rgba(37, 99, 235, 0.4)';
        }}
      >
        Learn About City Leaders
      </button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p style={{
          textAlign: 'left', 
          marginBottom: '24px',
          borderBottom: '1px solid #e5e7eb',
          color: '#6b7280',
          fontSize: '1.05rem',
          lineHeight: '1.7',
        }}>
          Detailed overview of each entity's role in integrating and planning geospatial data for green space development:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
{leaderData.map((item, index) => (
  <div
    key={index}
    style={{
      display: 'flex', 
      alignItems: 'flex-start',
      gap: '12px', 
      borderRadius: '12px',
      padding: '20px',
      background: '#ddebf4ff 100%',
      boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)',
      transition: 'all 0.3s ease',
      textAlign: 'left',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateX(4px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateX(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.1)';
    }}
  >
    {}
    <div
      style={{
        width: '8px',
        height: '8px',
        backgroundColor: '#2563eb',
        borderRadius: '50%',
        flexShrink: 0,
        marginTop: '6px', 
      }}
    ></div>

    {}
    <div>
      <p
        style={{
          fontSize: '1.1rem',
          fontWeight: '700',
          color: '#2563eb',
          marginBottom: '8px',
          margin: 0,
        }}
      >
        {item.org}
      </p>
      <p
        style={{
          color: '#374151',
          lineHeight: '1.6',
          margin: '0px 0 0 0',
          fontSize: '0.95rem',
        }}
      >
        {item.contribution}
      </p>
    </div>
  </div>
))}

        </div>
      </Modal>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

const infrastructureIcons: Record<string, string> = {
  'Civil Aerodrome': '✈️',
  'Cemetery': '🪦',
  'Shopping Center': '🛍️',
  'Medical Assistance Center': '🏥',
  'School': '🏫',
  'Land Transport Station': '🚌',
  'Urban Infrastructure': '🏢',
  'Communication Facility': '📡',
  'Geographic': '🌍',
  'Service Facility': '⚙️',
  'Sports or Recreational Facility': '🏃‍♂️',
  'Diverse Facility': '🧱',
  'Government Facility': '🏛️',
  'Market': '🛒',
  'Plaza': '⛲',
  'Well': '💧',
  'Pedestrian and/or Automobile Restriction': '🚧',
  'Electrical Substation': '🔌',
  'Water Tank': '🚰',
  'Temple': '⛪'
};

const MapSystem: React.FC = () => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [selectedGridId, setSelectedGridId] = useState<number | null>(null);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);
  const [carreterasData, setCarreterasData] = useState<any>(null);
  const [infrastructureData, setInfrastructureData] = useState<any>(null);
  const [demographicData, setDemographicData] = useState<any>(null);
  const [hydrologyData, setHydrologyData] = useState<any>(null);
  const [sueloVegetacionesData, setSueloVegetacionesData] = useState<any>(null);
  const [vegetacionJesusData, setVegetacionJesusData] = useState<any>(null);
  const [vegetationPercentageData, setVegetationPercentageData] = useState<any>(null);
  const [carreterasPorCuadradoData, setCarreterasPorCuadradoData] = useState<any>(null);
  const [populationData, setPopulationData] = useState<any[]>([]);
  const [infrastructureTypesData, setInfrastructureTypesData] = useState<any[]>([]);
  const [hydroData, setHydroData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const mapRef = useRef<L.Map | null>(null);

  const [showRoads, setShowRoads] = useState<boolean>(false);
  const [showInfrastructure, setShowInfrastructure] = useState<boolean>(false);
  const [showDemographics, setShowDemographics] = useState<boolean>(false);
  const [showHydrology, setShowHydrology] = useState<boolean>(false);
  const [showSoil, setShowSoil] = useState<boolean>(false);
  const [showVegetation, setShowVegetation] = useState<boolean>(false);

  const [temperature, setTemperature] = useState<number | null>(null);
  const [precipitation, setPrecipitation] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [heatIndex, setHeatIndex] = useState<number | null>(null);
  const [pm25, setPm25] = useState<number | null>(null);
  const [pm10, setPm10] = useState<number | null>(null);
  const [no2, setNo2] = useState<number | null>(null);
  const [gridData, setGridData] = useState<any>(null);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  const [mapMode, setMapMode] = useState('street');
  const streetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const satelliteMapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const streetAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const satelliteAttribution = '&copy; Esri';

  useEffect(() => {
    const latitude = 25.542;
    const longitude = -103.406;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,wind_speed_10m,uv_index,relative_humidity_2m`)
      .then(res => {
        if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Weather API response:', data);
        const current = data.current || {};
        setTemperature(current.temperature_2m ?? null);
        setPrecipitation(current.precipitation ?? null);
        setWindSpeed(current.wind_speed_10m ?? null);
        setUvIndex(current.uv_index ?? null);
        setHumidity(current.relative_humidity_2m ?? null);

        if (current.temperature_2m != null && current.relative_humidity_2m != null) {
          const t = current.temperature_2m;
          const h = current.relative_humidity_2m;
          const hi = Math.round(
            -8.784695 + 1.61139411 * t + 2.338549 * h - 0.14611605 * t * h
          );
          setHeatIndex(hi);
        } else {
          setHeatIndex(null);
        }
      })
      .catch(err => {
        console.error('Weather API fetch error:', err);
        setTemperature(null);
        setPrecipitation(null);
        setWindSpeed(null);
        setUvIndex(null);
        setHumidity(null);
        setHeatIndex(null);
      });

    fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm2_5,pm10,nitrogen_dioxide&domains=cams_global`)
      .then(res => {
        if (!res.ok) throw new Error(`Air Quality API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Air Quality API response:', data);
        const current = data.current || {};
        setPm25(current.pm2_5 ?? null);
        setPm10(current.pm10 ?? null);
        setNo2(current.nitrogen_dioxide ?? null);
      })
      .catch(err => {
        console.error('Air Quality API fetch error:', err);
        setPm25(null);
        setPm10(null);
        setNo2(null);
      });
  }, []);

  const urbanData = [
    { emoji: '🌫️', title: 'Fine Particles (PM2.5)', value: pm25 !== null ? `${pm25} µg/m³` : 'N/A', source: 'Open-Meteo' },
    { emoji: '💨', title: 'Coarse Particles (PM10)', value: pm10 !== null ? `${pm10} µg/m³` : 'N/A', source: 'Open-Meteo' },
    { emoji: '☁️', title: 'Nitrogen Dioxide (NO₂)', value: no2 !== null ? `${no2} µg/m³` : 'N/A', source: 'Open-Meteo' },
    { emoji: '🌤️', title: 'Temperature', value: temperature !== null ? `${temperature}°C` : 'N/A', source: 'Open-Meteo' },
    { emoji: '🔥', title: 'Urban Heat Index', value: heatIndex !== null ? `${heatIndex}°C` : 'N/A', source: 'Calculated' },
    { emoji: '☀️', title: 'UV Index', value: uvIndex !== null ? uvIndex : 'N/A', source: 'Open-Meteo' },
    { emoji: '🌧️', title: 'Precipitation', value: precipitation !== null ? `${precipitation} mm` : 'N/A', source: 'Open-Meteo' },
    { emoji: '🌳', title: 'Vegetation Cover', value: '12%', source: 'INEGI' },
    { emoji: '👥', title: 'Population', value: '720,848', source: 'INEGI' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
      });

      Promise.all([
        fetch('/data/carreteras_ingles.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setCarreterasData(data))
          .catch(error => console.warn('⚠️ Failed to load roads:', error.message)),
        fetch('/data/infraestructura_ingles.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setInfrastructureData(data))
          .catch(error => console.warn('⚠️ Failed to load infrastructure:', error.message)),
        fetch('/data/datos_demografia.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setDemographicData(data))
          .catch(error => console.warn('⚠️ Failed to load demographic data:', error.message)),
        fetch('/data/hidrografia2.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setHydrologyData(data))
          .catch(error => console.warn('⚠️ Failed to load hydrology data:', error.message)),
        fetch('/data/suelo_veg_ingles.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setSueloVegetacionesData(data))
          .catch(error => console.warn('⚠️ Failed to load suelo_vegetaciones data:', error.message)),
        fetch('/data/grilla_10zonas.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setGridData(data))
          .catch(error => console.warn('⚠️ Failed to load grid data:', error.message)),
        fetch('/data/veg_total.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setVegetacionJesusData(data))
          .catch(error => console.warn('⚠️ Failed to load vegetacionjesus3 data:', error.message)),
        fetch('/data/porcentaje_vegetacion.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setVegetationPercentageData(data))
          .catch(error => console.warn('⚠️ Failed to load vegetation percentage data:', error.message)),
        fetch('/data/carreteras_por_cuadrado.geojson').then(response => response.ok ? response.json() : null)
          .then(data => data && setCarreterasPorCuadradoData(data))
          .catch(error => console.warn('⚠️ Failed to load carreteras por cuadrado data:', error.message)),
        fetch('/data/poblacion_limpia3.csv')
          .then(response => response.ok ? response.text() : null)
          .then(text => {
            if (text) {
              const rows = text.split('\n').slice(1);
              const parsedData = rows
                .filter(row => row.trim() !== '')
                .map(row => {
                  const [id, pob] = row.split(',');
                  return { id: parseInt(id), Pob_2010: parseInt(pob) };
                });
              setPopulationData(parsedData);
            }
          })
          .catch(error => console.warn('⚠️ Failed to load population data:', error.message)),
        fetch('/data/infra.csv')
          .then(response => response.ok ? response.text() : null)
          .then(text => {
            if (text) {
              const rows = text.split('\n').slice(1);
              const parsedData = rows
                .filter(row => row.trim() !== '')
                .map(row => {
                  const [id, geografico] = row.split(',');
                  return { id: parseInt(id), GEOGRAFICO: geografico.trim() };
                });
              setInfrastructureTypesData(parsedData);
            }
          })
          .catch(error => console.warn('⚠️ Failed to load infrastructure types data:', error.message)),
        fetch('/data/hidro.csv')
          .then(response => response.ok ? response.text() : null)
          .then(text => {
            if (text) {
              const rows = text.split('\n').slice(1);
              const parsedData = rows
                .filter(row => row.trim() !== '')
                .map(row => {
                  const [id, pct_hidro] = row.split(',');
                  return { id: parseInt(id), pct_hidro: parseFloat(pct_hidro) };
                });
              setHydroData(parsedData);
            }
          })
          .catch(error => console.warn('⚠️ Failed to load hydrology percentage data:', error.message))
      ]).finally(() => setIsLoading(false));
    }
  }, []);

  const getRoadLength = (gridId: number | null): number => {
    if (!gridId || !carreterasPorCuadradoData || !carreterasPorCuadradoData.features) return 0;
    const roadsInGrid = carreterasPorCuadradoData.features.filter(
      (f: any) => f.properties && f.properties.id_2 === gridId
    );
    return roadsInGrid.reduce((total: number, feature: any) => {
      return total + (feature.properties.LONGITUD || 0);
    }, 0);
  };

  const getPopulation = (gridId: number | null): number => {
    if (!gridId || !populationData) return 0;
    return populationData
      .filter((row: any) => row.id === gridId)
      .reduce((total: number, row: any) => total + (row.Pob_2010 || 0), 0);
  };

  const getInfrastructureTypes = (gridId: number | null): string[] => {
    if (!gridId || !infrastructureTypesData) return [];
    const types = infrastructureTypesData
      .filter((row: any) => row.id === gridId)
      .map((row: any) => row.GEOGRAFICO);
    return Array.from(new Set(types));
  };

  const getVegetationPercentage = (gridId: number | null): number => {
    if (!gridId || !vegetationPercentageData || !vegetationPercentageData.features) return 0;
    const feature = vegetationPercentageData.features.find(
      (f: any) => f.properties && f.properties.id === gridId
    );
    return feature ? feature.properties.porcentaje_area : 0;
  };

  const getHydroPercentage = (gridId: number | null): number => {
    if (!gridId || !hydroData) return 0;
    const row = hydroData.find((row: any) => row.id === gridId);
    return row ? row.pct_hidro : 0;
  };

  const MapEvents = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  const getHealthScoreColor = (score: number): string => {
    if (score >= 80) return 'health-good';
    if (score >= 60) return 'health-medium';
    return 'health-poor';
  };

  const handleMarkerClick = (neighborhood: Neighborhood, gridId: number): void => {
    if (!carreterasPorCuadradoData || !vegetationPercentageData || !populationData || !infrastructureTypesData || !hydroData) return;
    setSelectedNeighborhood(neighborhood);
    setSelectedGridId(gridId);
  };

  const handleCloseModal = () => {
    setSelectedNeighborhood(null);
    setSelectedGridId(null);
  };

  const healthScoreStyles: Record<string, React.CSSProperties> = {
    'health-good': { color: '#16a34a', backgroundColor: '#dcfce7', borderColor: '#bbf7d0' },
    'health-medium': { color: '#ca8a04', backgroundColor: '#fef3c7', borderColor: '#fde68a' },
    'health-poor': { color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  };

  const roadStyle = (feature: any) => {
    const roadType = feature.properties?.TIPOVIA || '';
    let color = '#FF0000';
    if (roadType === 'Highway') color = '#FF0000';
    else if (roadType === 'Street') color = '#0000FF';
    else if (roadType === 'Beltway') color = '#00FF00';
    return {
      color,
      weight: 6,
      opacity: 1,
      zIndex: 1000,
    };
  };

  const infrastructureStyle = (feature: any) => {
    const infraType = feature.properties?.GEOGRAFICO || 'geografico';
    let color = '#d97706';
    switch (infraType) {
      case 'Aerodromo Civil': color = '#6b7280';
        break;
      case 'Cementerio': color = '#4b5563';
        break;
      case 'Centro Comercial': color = '#8b5cf6';
        break;
      case 'Centro de Asistencia Médica': color = '#dc2626';
        break;
      case 'Escuela': color = '#1d4ed8';
        break;
      case 'Estacion de Transporte Terrestre': color = '#f59e0b';
        break;
      case 'Infraestructura Urbana': color = '#9ca3af';
        break;
      case 'Instalación de Comunicación': color = '#d97706';
        break;
      case 'Geografico': color = '#6ee7b7';
        break;
      case 'Instalación de Servicios': color = '#ec4899';
        break;
      case 'Instalación Deportiva o Recreativa': color = '#10b981';
        break;
      case 'Instalación Diversa': color = '#475569';
        break;
      case 'Instalacion Gubernamental': color = '#1e40af';
        break;
      case 'Mercado': color = '#facc15';
        break;
      case 'Plaza': color = '#34d399';
        break;
      case 'Pozo': color = '#3b82f6';
        break;
      case 'Restricciones de paso a peatones o automoviles': color = '#ef4444';
        break;
      case 'Subestacion electrica': color = '#eab308';
        break;
      case 'Tanque de agua': color = '#60a5fa';
        break;
      case 'Templo': color = '#7c3aed';
        break;
    }
    return {
      color,
      weight: 4,
      opacity: 0.8,
      zIndex: 900,
    };
  };

  const getInfrastructureIcon = (feature: any) => {
    const infraType = feature.properties?.GEOGRAFICO || 'geografico';
    const emoji = infrastructureIcons[infraType] || '🏗️';
    return L.divIcon({
      html: `<div style="font-size: 24px; text-shadow: 0 0 4px rgba(0, 0, 0, 0.5);">${emoji}</div>`,
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  const demographicStyle = (feature: any) => ({
    color: '#800080',
    weight: 3,
    opacity: 0.7,
    zIndex: 800,
    fillOpacity: 0.3,
  });

  const hydrologyStyle = (feature: any) => ({
    color: '#1E90FF',
    weight: 3,
    opacity: 0.8,
    zIndex: 850,
    fillOpacity: 0,
  });

  const sueloVegetacionesStyle = (feature: any) => ({
    color: '#3fa43fff',
    weight: 3,
    opacity: 1,
    fillOpacity: 0.3,
    zIndex: 700,
  });

  const vegetacionJesusStyle = (feature: any) => {
    const clase = feature.properties?.clase || 1;
    let color = clase === 1 ? '#32CD32' : '#228B22';
    return {
      color,
      weight: 3,
      opacity: 0.9,
      fillOpacity: 0.6,
      zIndex: 750,
    };
  };

  const gridStyle = (feature: any) => {
    const id = feature.properties?.id || 'N/A';
    let color = id % 2 === 0 ? '#1e40af' : '#3b82f6';
    return {
      color,
      weight: 2,
      opacity: 0.8,
      fillColor: '#bfdbfe',
      fillOpacity: 0.3,
      zIndex: 950,
    };
  };

  const handleRecommendationsToggle = () => {
    const newShowRecommendations = !showRecommendations;
    setShowRecommendations(newShowRecommendations);
    if (newShowRecommendations) {
      setShowRoads(false);
      setShowInfrastructure(false);
      setShowDemographics(false);
      setShowHydrology(false);
      setShowSoil(false);
      setShowVegetation(false);
      setShowGrid(true);
    } else {
      setShowGrid(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <div>Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#f9fafb' }}>
      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .carousel:hover .slider {
          animation-play-state: paused;
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          zIndex: 1001,
          padding: '16px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', alignItems: 'center', gap: '0px' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 1vw, 2em)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 40%, #10b981 70%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1',
            fontFamily: '"SF Pro Display", sans-serif',
            letterSpacing: '-0.03em',
          }}>
            Torreón Smart City
          </h1>

          <Link
            href="/"
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              zIndex: 100,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              color: '#7c3aed',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '0.95rem',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(124, 58, 237, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.15)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>←</span>
            Back to Home
          </Link>

          <LeaderButtonModal />

          <div style={{
            position: 'absolute',
            top: '60px',
            right: '20px',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '20px',
            marginTop: '0px',
            marginBottom: '0px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#ef4444',
              boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)',
              animation: 'pulse-live 2s infinite',
            }} />
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: '#ef4444',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: '"SF Pro Display", sans-serif',
            }}>
              Live Data
            </span>
          </div>

          <div className="carousel" style={{ overflow: 'hidden', width: '100%', height: '80px', marginTop: '0px' }}>
            <div className="slider" style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'scroll-left 50s linear infinite' }}>
              {urbanData.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: '200px',
                    marginRight: '10px',
                    padding: '5px',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                  <h3 style={{ fontSize: '12px', margin: '4px 0', color: '#111827' }}>{item.title}</h3>
                  <p style={{ fontSize: '10px', fontWeight: 'regular', margin: '0', color: '#111827' }}>{item.value}</p>
                  <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>Source: {item.source}</p>
                </div>
              ))}
              {urbanData.map((item, idx) => (
                <div
                  key={`dup-${idx}`}
                  style={{
                    minWidth: '200px',
                    marginRight: '10px',
                    padding: '5px',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.emoji}</span>
                  <h3 style={{ fontSize: '12px', margin: '4px 0', color: '#111827' }}>{item.title}</h3>
                  <p style={{ fontSize: '10px', fontWeight: 'bold', margin: '0', color: '#111827' }}>{item.value}</p>
                  <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>Source: {item.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: '210px', overflow: 'hidden', height: '100%', display: 'flex' }}>
        <div style={{ width: '280px', overflow: 'hidden',backgroundColor: 'white', padding: '16px', zIndex: 100 }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Choose mode
          </h2>
          <button
            onClick={() => setMapMode(mapMode === 'satellite' ? 'street' : 'satellite')}
            style={{
              background: mapMode === 'satellite'
                ? 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
                : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              color: mapMode === 'satellite' ? 'white' : 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              fontSize: '19px',
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 9px 0 #087591ff, 0 15px 30px rgba(6, 85, 98, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 0 #087591ff, 0 12px 25px rgba(6, 85, 98, 0.5)';
            }}
          >
            {mapMode === 'satellite' ? ' 🌍 Street View' : ' 🛰️ Satellite View'}
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '29px' }}></h2>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Data
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Click a layer to see its data. Click any component on the map for more information.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showRoads}
                onChange={() => setShowRoads(!showRoads)}
                disabled={showRecommendations}
              />
              <span>🛣️ Roads</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showInfrastructure}
                onChange={() => setShowInfrastructure(!showInfrastructure)}
                disabled={showRecommendations}
              />
              <span>🏗️ Infrastructure</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showDemographics}
                onChange={() => setShowDemographics(!showDemographics)}
                disabled={showRecommendations}
              />
              <span>👥 Demographics</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showHydrology}
                onChange={() => setShowHydrology(!showHydrology)}
                disabled={showRecommendations}
              />
              <span>💧 Hydrology</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showSoil}
                onChange={() => setShowSoil(!showSoil)}
                disabled={showRecommendations}
              />
              <span>🌱 Soil</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showVegetation}
                onChange={() => setShowVegetation(!showVegetation)}
                disabled={showRecommendations}
              />
              <span>🌿 Vegetation</span>
            </label>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            Recommendations
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
            Click to view data-driven recommendations for each area. Click any square to see specific recommendations.
          </p>
          <button
            onClick={handleRecommendationsToggle}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '17px',
              padding: '1.5rem 2.5rem',
              fontSize: '1.056rem',
              fontWeight: '600',
              fontFamily: '"SF Pro Display", sans-serif',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 9px 0 #047857, 0 15px 25px rgba(16,185,129,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 0 #047857, 0 12px 20px rgba(16,185,129,0.3)';
            }}
          >
            {showRecommendations ? ' 🔒 Hide recommendations' : ' 💡 Recommendations'}
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '26px' }}></h2>
        </div>

        <div style={{ flex: 1, height: '100%' }}>
          <MapContainer
            center={[25.542, -103.406]}
            zoom={15}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <MapEvents />
            <TileLayer
              url={mapMode === 'satellite' ? satelliteMapUrl : streetMapUrl}
              attribution={mapMode === 'satellite' ? satelliteAttribution : streetAttribution}
            />

            {showRoads && carreterasData && !showRecommendations && (
              <GeoJSON
                data={carreterasData}
                style={roadStyle}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    const props = feature.properties;
                    layer.bindPopup(`
                      <div style="padding: 8px;">
                        <strong style="font-size: 16px;">🛣️ ${props.TIPOVIA || 'Road'}</strong><br/><br/>
                        <strong>Type:</strong> ${props.TIPO || 'N/A'}<br/>
                        <strong>Number:</strong> ${props.NUMERO || 'N/A'}<br/>
                        <strong>Condition:</strong> ${props.CONDICION || 'N/A'}<br/>
                        <strong>Transit Rights:</strong> ${props.DERE_TRAN || 'N/A'}<br/>
                        <strong>Length:</strong> ${props.LONGITUD || 'N/A'} ${props.UNIDAD || ''}<br/>
                        <strong>Administered by:</strong> ${props.ADMINISTRA || 'N/A'}
                      </div>
                    `);
                  }
                }}
              />
            )}

            {showInfrastructure && infrastructureData && !showRecommendations && (
              <GeoJSON
                data={infrastructureData}
                style={infrastructureStyle}
                pointToLayer={(feature, latlng) => {
                  return L.marker(latlng, { icon: getInfrastructureIcon(feature) });
                }}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    const props = feature.properties;
                    const infraType = props.GEOGRAFICO || 'geografico';
                    const emoji = infrastructureIcons[infraType] || '🏗️';
                    layer.bindPopup(`
                      <div style="padding: 8px;">
                        <strong style="font-size: 16px;">${emoji} ${props.GEOGRAFICO || 'Infrastructure'}</strong><br/><br/>
                        <strong>Name:</strong> 
                        ${!props.NOMSERV || props.NOMSERV.toLowerCase() === 'ninguno' ? 'N/A' : props.NOMSERV}
                        <br/>
                        <strong>Type:</strong> ${props.TIPO || 'N/A'}<br/>
                        <strong>Condition:</strong> ${props.CONDICION || 'N/A'}<br/>
                        <strong>Scope:</strong> ${props.AMBITO || 'N/A'}
                      </div>
                    `);
                  }
                }}
              />
            )}

            {showDemographics && demographicData && !showRecommendations && (
              <GeoJSON
                data={demographicData}
                style={demographicStyle}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    const props = feature.properties;
                    layer.bindPopup(`
                      <div style="padding: 8px;">
                        <strong style="font-size: 16px;">👥 Demographic Data</strong><br/><br/>
                        <strong>SUN:</strong> ${props.sun || 'N/A'}<br/>
                        <strong>Population:</strong> ${props.Pob_2010 || 'N/A'}<br/>
                        <strong>Employment:</strong> ${props.Empleo || 'N/A'}<br/>
                        <strong>Basic Education:</strong> ${props.E_basica || 'N/A'}<br/>
                        <strong>Secondary Education:</strong> ${props.E_media || 'N/A'}<br/>
                        <strong>Higher Education:</strong> ${props.E_superior || 'N/A'}<br/>
                        <strong>Culture:</strong> ${props.Cultura || 'N/A'}<br/>
                        <strong>Health Services:</strong> ${props.Salud_cons || 'N/A'}<br/>
                        <strong>Supply Points:</strong> ${props.Abasto || 'N/A'}
                      </div>
                    `);
                  }
                }}
              />
            )}

            {showHydrology && hydrologyData && !showRecommendations && (
              <GeoJSON
                data={hydrologyData}
                style={hydrologyStyle}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    const props = feature.properties;
                    layer.bindPopup(`
                      <div style="padding: 8px;">
                        <strong style="font-size: 16px;">💧 Hydrology Feature</strong><br/><br/>
                        <strong>Value:</strong> ${props.value || 'N/A'}
                      </div>
                    `);
                  }
                }}
              />
            )}

            {showSoil && sueloVegetacionesData && !showRecommendations && (
              <GeoJSON
                data={sueloVegetacionesData}
                style={sueloVegetacionesStyle}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    const props = feature.properties;
                    layer.bindPopup(`
                      <div style="padding: 8px;">
                        <strong style="font-size: 16px;">🌱 ${props.OTROS || 'Soil'}</strong><br/><br/>
                        <strong>Information Type:</strong> ${props.Information_type || 'N/A'}
                        <strong>Complementary Information:</strong> ${props.Complementary_information || 'N/A'}
                      </div>
                    `);
                  }
                }}
              />
            )}

            {showVegetation && vegetacionJesusData && !showRecommendations && (
              <GeoJSON
                data={vegetacionJesusData}
                style={vegetacionJesusStyle}
                onEachFeature={(feature, layer) => {
                  if (feature.properties) {
                    const props = feature.properties;
                    layer.bindPopup(`
                      <div style="padding: 8px;">
                        <strong style="font-size: 16px;">🌿 Vegetation</strong><br/><br/>
                        <strong>Value:</strong> ${props.value || 'N/A'}<br/>
                        <strong>Class:</strong> ${props.clase || 'N/A'}
                      </div>
                    `);
                  }
                }}
              />
            )}

            {showRecommendations && showGrid && gridData && (
              <GeoJSON
                data={gridData}
                style={gridStyle}
                onEachFeature={(feature, layer) => {
                  const neighborhood = mockData.neighborhoods[0];
                  const gridId = feature.properties?.id || 'N/A';
                  layer.on('click', () => handleMarkerClick(neighborhood, gridId));
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>

      {selectedNeighborhood && selectedGridId !== null && carreterasPorCuadradoData && vegetationPercentageData && populationData && infrastructureTypesData && hydroData && (
        <RecommendationModal
          neighborhood={selectedNeighborhood}
          gridId={selectedGridId}
          vegetationPercentage={getVegetationPercentage(selectedGridId)}
          roadLength={getRoadLength(selectedGridId)}
          population={getPopulation(selectedGridId)}
          infrastructureTypes={getInfrastructureTypes(selectedGridId)}
          hydroPercentage={getHydroPercentage(selectedGridId)}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MapSystem;