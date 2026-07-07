import { PropertyImage } from "@prisma/client";

export function toImageResponse(image: PropertyImage) {

    return {
        id: image.id,
        url: `/uploads/${image.fileName}`,
        isPrimary: image.isPrimary,
        displayOrder: image.displayOrder
    };
}
