import { Prisma } from "@prisma/client";
import { userSelect } from "../prisma/user.select.js";
import { UserResponse } from "../dto/user.response.js";

type UserEntity = Prisma.UserGetPayload<{
    select: typeof userSelect;
}>;

export function toUserResponse(
    user: UserEntity
): UserResponse {

    return {

        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt

    };

}