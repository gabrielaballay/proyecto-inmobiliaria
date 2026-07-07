import { PropertyOperation, PropertyStatus, PropertyType } from "@prisma/client";
import { z } from "zod";

export const createPropertySchema = z.object({

    title: z.string().min(5, {
        error: "El título debe tener al menos 5 caracteres."
    }),

    description: z.string().min(10, {
        error: "La descripción es demasiado corta."
    }),

    price: z.coerce.number().positive({
        error: "El precio debe ser mayor a cero."
    }),

    operation: z.enum(PropertyOperation),
    type: z.enum(PropertyType),
    address: z.string().min(3),
    city: z.string().min(2),
    province: z.string().min(2),
    zipCode: z.string().optional(),
    bedrooms: z.coerce.number().min(0),
    bathrooms: z.coerce.number().min(0),
    garages: z.coerce.number().min(0),
    coveredSurface: z.coerce.number().optional(),
    totalSurface: z.coerce.number().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    status: z.enum(PropertyStatus).default(PropertyStatus.AVAILABLE),
    features: z.array(z.string()).default([])
});

export type CreatePropertyDto =
    z.infer<typeof createPropertySchema>;

export const updatePropertySchema =
    createPropertySchema.partial();

export type UpdatePropertyDto =
    z.infer<typeof updatePropertySchema>;