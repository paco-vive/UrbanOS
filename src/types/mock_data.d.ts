export interface Neighborhood {
  name: string;
  coordinates: [number, number] | number[]; 
  temperature: number;
  vegetation: number;
  airQuality: number;
  naturalResources: {
    vegetation: string;
    water: string;
    greenAreas: number;
  };
  infrastructure: {
    streets: string;
    buildings: string;
    hospitals: number;
  };
  ecosystem: {
    habitats: string;
    biodiversity: string;
  };
  recommendations: Array<{
    change: string;
    impact: string;
  }>;
}

export interface MockData {
  city: string;
  neighborhoods: Neighborhood[];
}