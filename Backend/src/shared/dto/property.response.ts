export interface PropertyResponse {

    id: string;
    title: string;
    description: string;
    price: number;
    operation: string;
    type: string;
    status: string;
    address: string;
    city: string;
    province: string;
    zipCode?: string | null;
    bedrooms: number;
    bathrooms: number;
    garages: number;
    coveredSurface?: number | null;
    totalSurface?: number | null;
    featured: boolean;
    published: boolean;
    features: string[];
    images: {
        id: string;
        url: string;
        isPrimary: boolean;
        displayOrder: number;
    }[];

    createdAt: Date;
}