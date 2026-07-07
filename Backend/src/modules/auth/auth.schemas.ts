import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .check(
            z.email({error : "El correo electrónico no es válido"}),
        ),

    password: z
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
});

export type LoginDto = z.infer<typeof loginSchema>;

export const updateMeSchema = z.object({

    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),

    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),

    email: z.email({ error: "El correo electrónico no es válido" })

});

export type UpdateMeDto = z.infer<typeof updateMeSchema>;

export const changePasswordSchema = z.object({

    currentPassword: z.string().min(1, "Debe ingresar su contraseña actual"),

    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres")

});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;