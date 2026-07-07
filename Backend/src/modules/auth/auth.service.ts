import prisma from "../../lib/prisma.js";
import { verifyPassword, hashPassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";
import { LoginDto, UpdateMeDto, ChangePasswordDto } from "./auth.schemas.js";
import AppError from "../../errors/AppError.js";
import { toUserResponse } from "../../shared/mappers/user.mapper.js";
import { userSelect } from "../../shared/prisma/user.select.js";

class AuthService {

    async login(data: LoginDto) {

        const user = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (!user)
            throw new Error("Correo o contraseña incorrectos.");

        if (!user.active)
            throw new Error("El usuario se encuentra deshabilitado.");

        const passwordValid = await verifyPassword(
            data.password,
            user.passwordHash
        );

        if (!passwordValid)
            throw new Error("Correo o contraseña incorrectos.");

        const token = generateToken({
            userId: user.id,
            role: user.role
        });

        return {
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        };
    }

    async getMe(userId: string) {

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: userSelect
        });

        if (!user)
            throw new AppError("Usuario no encontrado.", 404);

        return toUserResponse(user);
    }

    async updateMe(userId: string, data: UpdateMeDto) {

        const emailOwner = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (emailOwner && emailOwner.id !== userId)
            throw new AppError("Ya existe un usuario con ese correo.", 409);

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data,
            select: userSelect
        });

        return toUserResponse(user);
    }

    async changePassword(userId: string, data: ChangePasswordDto) {

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user)
            throw new AppError("Usuario no encontrado.", 404);

        const passwordValid = await verifyPassword(
            data.currentPassword,
            user.passwordHash
        );

        if (!passwordValid)
            throw new AppError("La contraseña actual es incorrecta.", 400);

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                passwordHash: await hashPassword(data.newPassword)
            }
        });
    }
}

export default new AuthService();