import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL!;

    const adminExists = await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    });

    if (adminExists) {
        console.log("✔ El usuario administrador ya existe.");
        return;
    }

    const adminPassword = process.env.ADMIN_PASSWORD!;
    const passwordHash = await hashPassword(adminPassword);

    await prisma.user.create({
        data: {
            firstName: "Administrador",
            lastName: "Sistema",
            email: adminEmail,
            passwordHash,
            role: UserRole.ADMIN
        }
    });

    console.log("✔ Usuario administrador creado correctamente.");
}

main()
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
