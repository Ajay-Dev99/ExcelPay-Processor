import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {

    const hashedPassword = await bcrypt.hash("password123", 10);

    await prisma.user.create({
        data: {
            email: "lusaibnetstager@gmail.com",
            passwordHash: hashedPassword
        }
    });

    console.log("Seed user created successfully");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });