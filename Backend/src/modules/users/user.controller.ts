import { Request, Response, NextFunction } from "express";
import { createUserSchema, updateUserSchema } from "./user.schemas.js";
import userService from "./user.service.js";
import { IdRequest } from "../../types/http.js";

class UserController {

    async create(req: Request, res: Response) {
        try {
            const data =
                createUserSchema.parse(req.body);

            const user =
                await userService.create(data);

            return res.status(201).json(user);
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
        const users =
            await userService.getAll();

        return res.json(users);
    }

    async changeStatus(
        req: IdRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user =
                await userService.changeStatus(req.params.id);

            return res.json(user);
        }
        catch (error) {
            next(error);
        }
    }

    async update(req: IdRequest, res: Response, next: NextFunction) {
        try {
            const data =
                updateUserSchema.parse(req.body);

            const user =
                await userService.update(
                    req.body,
                    data
                );

            return res.json(user);
        }
        catch (error) {
            next(error);
        }
    }

    async delete(req: IdRequest, res: Response, next: NextFunction) {
        try {
            await userService.delete(req.params.id);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }

}

export default new UserController();