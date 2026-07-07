import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export function authorize(...roles: UserRole[]) {

    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        if (!req.user) {
            return res.status(401).json({
                message: "No autenticado."
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "No tiene permisos para realizar esta acción."
            });
        }

        next();
    };
}