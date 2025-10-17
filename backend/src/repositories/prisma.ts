/*
 * Custom Modules
 */
import { PrismaClient } from "@prisma/client";

/*
 * types
 */
import type { User as UserPrisma, Ticket as TicketPrisma, Comment as CommentPrisma } from "@prisma/client";

const prisma = new PrismaClient();

export type { UserPrisma, TicketPrisma, CommentPrisma };
export default prisma;
