import { prisma } from "../../config/prisma";
import { comparePassword, hashPassword } from "../../utils/PasswordUtilites";
import { generateToken } from "../../utils/jwt";
import { signupSchema, loginSchema } from "./auth.validation";
import { AppError } from "../../utils/AppError";

export const signupUser = async (data: any) => {

    const validated = signupSchema.parse(data);

    const existingUser = await prisma.user.findUnique({
        where: { email: validated.email },
    });

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const passwordHash = await hashPassword(validated.password);

    const user = await prisma.user.create({
        data: {
            email: validated.email,
            passwordHash,
        },
    });

    return user;
};

export const loginUser = async (data: any) => {

    const validated = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
        where: { email: validated.email },
    });

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await comparePassword(
        validated.password,
        user.passwordHash
    );

    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken(user.id);

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
        },
    };
};