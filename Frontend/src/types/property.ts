export type PropertyOperation = "VENTA" | "ALQUILER" | "TEMPORAL";

export type PropertyStatus =
    | "AVAILABLE"
    | "RESERVED"
    | "SOLD"
    | "RENTED";

export enum PropertyType {
    CASA = "CASA",
    DEPARTAMENTO = "DEPARTAMENTO",
    TERRENO = "TERRENO",
    GALPON = "GALPON",
    OFICINA = "OFICINA",
    LOCAL = "LOCAL"
}

export interface PropertyImage {
    id: string;
    url: string;
    isPrimary: boolean;
    displayOrder: number;
}

export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    operation: PropertyOperation;
    type: PropertyType;
    status: PropertyStatus;
    address: string;
    city: string;
    province: string;
    zipCode?: string;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    coveredSurface?: number;
    totalSurface?: number;
    featured: boolean;
    published: boolean;
    features: string[];
    images: PropertyImage[];
    createdAt: string;
    updatedAt: string;
}

export type ViewMode = "grid" | "list";