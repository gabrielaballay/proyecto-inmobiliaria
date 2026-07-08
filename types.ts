
export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  agency: string;
  bedrooms: number;
  bathrooms: number;
  surface: string;
  garages?: number;
  description: string;
  images: string[];
  features: string[];
  isFeatured?: boolean;
  operation: 'VENTA' | 'ALQUILER' | 'TEMPORAL';
  type: string;
}

export type ViewMode = 'grid' | 'list';
