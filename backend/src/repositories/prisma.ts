/*
 * Custom Modules
 */
import { PrismaClient } from "../generated/prisma";

/*
 * types
 */
import type { User as UserPrisma, Ticket as TicketPrisma, Comment as CommentPrisma } from "../generated/prisma";

const prisma = new PrismaClient();

export type { UserPrisma, TicketPrisma, CommentPrisma };
export default prisma;
