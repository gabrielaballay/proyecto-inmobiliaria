import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserRole } from "@prisma/client";

export interface JwtPayload {
    userId: string;
    role: UserRole;
}

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn,
    });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
}