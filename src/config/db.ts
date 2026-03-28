import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in .env file");
}

const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL as string
} as any);

export default prisma;
