import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { hashPassword } from "../../utils/password.js";

import {
    CreateUserDto,
    UpdateUserDto
} from "./user.schemas.js";
import { toUserResponse } from "../../shared/mappers/user.mapper.js";
import { userSelect } from "../../shared/prisma/user.select.js";

class UserService {

    async getAll() {
        const users = await prisma.user.findMany({
            select: userSelect,

            orderBy: {
                firstName: "asc"
            }
        });
        return users.map(toUserResponse);
    }

    async create(data: CreateUserDto) {

        const exists = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (exists)
            throw new AppError(
                "Ya existe un usuario con ese correo.",
                409
            );

        const { password, ...rest } = data;

        const user = await prisma.user.create({
            data: {
                ...rest,
                passwordHash: await hashPassword(password)
            }
        });
        return toUserResponse(user);
    }

    async update(
        id: string,
        data: UpdateUserDto
    ) {

        const exists =
            await prisma.user.findUnique({
                where: {
                    id
                }
            });

        if (!exists)
            throw new AppError(
                "Usuario no encontrado.",
                404
            );

        const user = await prisma.user.update({
            where: {
                id
            },
            data
        });
        return toUserResponse(user);
    }

    async changeStatus(id: string) {

        const user =
            await prisma.user.findUnique({
                where: {
                    id
                }
            });

        if (!user)
            throw new AppError(
                "Usuario no encontrado.",
                404
            );

        const updatedUser = await prisma.user.update({
            where: {
                id
            },
            data: {
                active: !user.active
            }
        });
        return toUserResponse(updatedUser);
    }

}

export default new UserService();