import { Prisma } from "@prisma/client";

export const userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    active: true,
    createdAt: true
} satisfies Prisma.UserSelect;