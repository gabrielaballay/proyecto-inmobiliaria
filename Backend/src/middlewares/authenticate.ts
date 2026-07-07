import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: "Token no proporcionado."
        });
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Token inválido."
        });
    }

    try {

        const payload = verifyToken(token);

        req.user = {
            id: payload.userId,
            role: payload.role
        };

        next();

    } catch {

        return res.status(401).json({
            message: "Token expirado o inválido."
        });

    }
}