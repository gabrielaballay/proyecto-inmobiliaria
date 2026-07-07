import { Request, Response } from "express";
import authService from "./auth.service.js";
import { loginSchema, updateMeSchema, changePasswordSchema } from "./auth.schemas.js";

class AuthController {

    async login(req: Request, res: Response) {

        try {

            const data = loginSchema.parse(req.body);

            const result = await authService.login(data);

            return res.status(200).json(result);

        } catch (error: any) {

            if (error.name === "ZodError") {
                return res.status(400).json({
                    message: "Datos inválidos.",
                    errors: error.issues
                });
            }

            return res.status(401).json({
                message: error.message
            });
        }

    }

    async me(req: Request, res: Response) {

        try {
            const user = await authService.getMe(req.user!.id);

            return res.status(200).json({ user });
        }
        catch (error: any) {
            return res.status(404).json({
                message: error.message
            });
        }

    }

    async updateMe(req: Request, res: Response) {

        try {
            const data = updateMeSchema.parse(req.body);

            const user = await authService.updateMe(req.user!.id, data);

            return res.status(200).json(user);
        }
        catch (error: any) {

            if (error.name === "ZodError") {
                return res.status(400).json({
                    message: "Datos inválidos.",
                    errors: error.issues
                });
            }

            return res.status(error.statusCode ?? 500).json({
                message: error.message
            });
        }

    }

    async changePassword(req: Request, res: Response) {

        try {
            const data = changePasswordSchema.parse(req.body);

            await authService.changePassword(req.user!.id, data);

            return res.sendStatus(204);
        }
        catch (error: any) {

            if (error.name === "ZodError") {
                return res.status(400).json({
                    message: "Datos inválidos.",
                    errors: error.issues
                });
            }

            return res.status(error.statusCode ?? 500).json({
                message: error.message
            });
        }

    }

}

export default new AuthController();