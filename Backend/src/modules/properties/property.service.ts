import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

import {CreatePropertyDto, UpdatePropertyDto} from "./property.schemas.js";
import { toPropertyResponse } from "../../shared/mappers/property.mapper.js";

class PropertyService {

    async create(data: CreatePropertyDto) {

        const property = await prisma.property.create({
            data,
            include: {
                images: {
                    orderBy: {
                        displayOrder: "asc"
                    }
                }
            }
        });

        return toPropertyResponse(property);
    }

    async getAll() {

        const properties = await prisma.property.findMany({
            include: {
                images: {
                    orderBy: {
                        displayOrder: "asc"
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return properties.map(toPropertyResponse);
    }

    async getById(id: string) {

        const property = await prisma.property.findUnique({
            where: {
                id
            },
            include: {
                images: {
                    orderBy: {
                        displayOrder: "asc"
                    }
                }
            }
        });

        if (!property) {
            throw new AppError(
                "Propiedad no encontrada.",
                404
            );
        }

        return toPropertyResponse(property);
    }

    async update(
        id: string,
        data: UpdatePropertyDto
    ) {

        const exists = await prisma.property.findUnique({
            where: {
                id
            }
        });

        if (!exists) {
            throw new AppError(
                "Propiedad no encontrada.",
                404
            );
        }

        const property = await prisma.property.update({
            where: {
                id
            },
            data,
            include: {
                images: {
                    orderBy: {
                        displayOrder: "asc"
                    }
                }
            }
        });

        return toPropertyResponse(property);
    }

    async delete(id: string) {

        const exists = await prisma.property.findUnique({
            where: {
                id
            }
        });

        if (!exists) {
            throw new AppError(
                "Propiedad no encontrada.",
                404
            );
        }

        await prisma.property.delete({
            where: {
                id
            }
        });
    }

}

export default new PropertyService();