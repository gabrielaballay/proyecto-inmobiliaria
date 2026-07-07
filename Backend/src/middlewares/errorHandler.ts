import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../errors/AppError.js";

export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Datos inválidos.",
            errors: error.issues
        });
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        message: "Error interno del servidor."
    });

}