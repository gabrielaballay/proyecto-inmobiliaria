import { Request, Response, NextFunction } from "express";
import propertyService from "./property.service.js";
import { createPropertySchema, updatePropertySchema } from "./property.schemas.js";
import { IdRequest } from "../../types/http.js";

class PropertyController {

    async create(req: Request, res: Response) {
        try {
            const data =
                createPropertySchema.parse(req.body);

            const property =
                await propertyService.create(data);

            return res.status(201).json(property);
        }
        catch (error: any) {
            if (error.name === "ZodError") {

                return res.status(400).json({
                    message: "Datos inválidos.",
                    errors: error.issues
                });

            }

            return res.status(500).json({
                message: error.message
            });
        }
    }

    async getAll(req: Request, res: Response) {
        const properties =
            await propertyService.getAll();

        return res.json(properties);
    }

    async getById(
        req: IdRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const property =
                await propertyService.getById(req.params.id);

            return res.json(property);
        }
        catch (error) {
            next(error);
        }
    }

    async update(req: IdRequest, res: Response, next: NextFunction) {
        try {
            const data =
                updatePropertySchema.parse(req.body);

            const property =
                await propertyService.update(
                    req.params.id,
                    data
                );

            return res.json(property);
        }
        catch (error) {
            next(error);
        }
    }

    async delete(req: IdRequest, res: Response, next: NextFunction) {
        try{
            await propertyService.delete(req.params.id);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }

}

export default new PropertyController();