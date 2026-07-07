import { NextFunction, Response, Request } from "express";
import { IdRequest } from "../../types/http.js";
import propertyImageService from "./propertyImage.service.js";
import { reorderImagesSchema } from "./propertyImage.schemas.js";

class PropertyImageController {

    async upload(
        req: IdRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const files =
                req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                return res.status(400).json({
                    message: "Debe seleccionar al menos una imagen."
                });
            }

            const result =
                await propertyImageService.upload(
                    req.params.id,
                    files
                );

            return res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }

    async delete(
        req: IdRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            await propertyImageService.delete(req.params.id);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }

    async setPrimary(
        req: IdRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            await propertyImageService.setPrimary(
                req.params.id
            );

            return res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    }

    async reorder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const body =
                reorderImagesSchema.parse(req.body);
            await propertyImageService.reorder(
                body.imageIds
            );

            return res.sendStatus(204);
        }
        catch (error) {
            next(error);
        }
    }

}

export default new PropertyImageController();