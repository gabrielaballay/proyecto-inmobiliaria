import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import fs from "fs/promises";
import path from "path";

class PropertyImageService {

    async upload(
        propertyId: string,
        files: Express.Multer.File[]
    ) {

        const property = await prisma.property.findUnique({
            where: {
                id: propertyId
            }
        });

        if (!property) {
            throw new AppError("La propiedad no existe.", 404);
        }

        const currentImages = await prisma.propertyImage.count({
            where: {
                propertyId
            }
        });

        const images = await prisma.$transaction(
            files.map((file, index) =>
                prisma.propertyImage.create({
                    data: {
                        propertyId,
                        fileName: file.filename,
                        displayOrder: currentImages + index,
                        isPrimary: currentImages === 0 && index === 0
                    }
                })
            )
        );

        return images;
    }

    async delete(imageId: string) {
        const image = await prisma.propertyImage.findUnique({
            where: {
                id: imageId
            }
        });

        if (!image) {
            throw new AppError("La imagen no existe.", 404);
        }

        const filePath = path.resolve(
            "uploads",
            "properties",
            image.fileName
        );

        try {
            await fs.unlink(filePath);
        } catch {
            // Si el archivo no existe no detenemos la operación
        }

        await prisma.propertyImage.delete({
            where: {
                id: imageId
            }
        });

        const remainingImages = await prisma.propertyImage.findMany({
            where: {
                propertyId: image.propertyId
            },
            orderBy: {
                displayOrder: "asc"
            }
        });

        if (remainingImages.length > 0) {
            const primary = remainingImages.find(i => i.isPrimary);
            if (!primary) {
                await prisma.propertyImage.update({
                    where: {
                        id: remainingImages[0].id
                    },
                    data: {
                        isPrimary: true
                    }
                });
            }
        }
    }

    async setPrimary(imageId: string) {
        const image = await prisma.propertyImage.findUnique({
            where: {
                id: imageId
            }
        });

        if (!image) {
            throw new AppError("La imagen no existe.", 404);
        }

        await prisma.$transaction([
            prisma.propertyImage.updateMany({
                where: {
                    propertyId: image.propertyId
                },
                data: {
                    isPrimary: false
                }
            }),

            prisma.propertyImage.update({
                where: {
                    id: imageId
                },
                data: {
                    isPrimary: true
                }
            })
        ]);
    }

    async reorder(imageIds: string[]) {
        await prisma.$transaction(
            imageIds.map((id, index) =>
                prisma.propertyImage.update({
                    where: {
                        id
                    },
                    data: {
                        displayOrder: index
                    }
                })
            )
        );
    }
    
}

export default new PropertyImageService();