/*
 * Custom Modules
 */
import { PrismaClient } from "../generated/prisma";

/*
 * types
 */
import type { User as UserPrisma } from "../generated/prisma";

const prisma = new PrismaClient();

export type { UserPrisma };
export default prisma;
