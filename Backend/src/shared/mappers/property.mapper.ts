import { Prisma, Property, PropertyImage } from "@prisma/client";

import { PropertyResponse } from "../dto/property.response.js";
import { toImageResponse } from "./image.mapper.js";
import { propertySelect } from "../prisma/property.select.js";

type PropertyEntity =
    Prisma.PropertyGetPayload<{
        select: typeof propertySelect;
    }>;
    
type PropertyWithImages =
    PropertyEntity & {

        images: PropertyImage[];

    };

export function toPropertyResponse(
    property: PropertyWithImages
): PropertyResponse {

    return {
        id: property.id,
        title: property.title,
        description: property.description,
        price: Number(property.price),
        operation: property.operation,
        type: property.type,
        status: property.status,
        address: property.address,
        city: property.city,
        province: property.province,
        zipCode: property.zipCode,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        garages: property.garages,
        coveredSurface: property.coveredSurface,
        totalSurface: property.totalSurface,
        featured: property.featured,
        published: property.published,
        features: (property.features as string[]) ?? [],
        images: property.images.map(toImageResponse),
        createdAt: property.createdAt
    };
}