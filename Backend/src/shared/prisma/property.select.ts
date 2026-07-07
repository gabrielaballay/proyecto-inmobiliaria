import { Prisma } from "@prisma/client";

export const propertySelect = {

    id: true,
    title: true,
    description: true,
    price: true,
    operation: true,
    type: true,
    status: true,
    address: true,
    city: true,
    province: true,
    zipCode: true,
    bedrooms: true,
    bathrooms: true,
    garages: true,
    coveredSurface: true,
    totalSurface: true,
    featured: true,
    published: true,
    features: true,
    createdAt: true,
    images: {
        orderBy: {
            displayOrder: "asc"
        }
    }

} satisfies Prisma.PropertySelect;