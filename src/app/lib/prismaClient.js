//Prisma client import
import { PrismaClient } from "@prisma/client";

const globalPrisma = global;
const prisma = globalPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalPrisma.prisma = prisma;

export default prisma;