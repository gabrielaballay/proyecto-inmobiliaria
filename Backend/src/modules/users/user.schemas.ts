import { UserRole } from "@prisma/client";
import { z } from "zod";

export const createUserSchema = z.object({

    firstName: z.string().min(2),

    lastName: z.string().min(2),

    email: z.email(),

    password: z.string().min(8),

    role: z.enum(UserRole)

});

export type CreateUserDto =
    z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial().omit({
    password: true
});

export type UpdateUserDto =
    z.infer<typeof updateUserSchema>;