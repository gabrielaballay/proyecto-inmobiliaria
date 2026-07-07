import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/utils/password.js";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@oriente.com";

    const adminExists = await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    });

    if (adminExists) {
        console.log("✔ El usuario administrador ya existe.");
        return;
    }

    const passwordHash = await hashPassword("Admin123*");

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