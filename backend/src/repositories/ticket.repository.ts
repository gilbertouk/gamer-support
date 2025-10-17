/*
 * Custom Modules
 */
import { TicketModel } from "../models/ticket.model";
import { CommentModel } from "../models/comment.model";
import database from "./prisma";

/*
 * Types
 */
import type { ITicketRepository } from "./interfaces";
import type { TicketPrisma } from "./prisma";
import type { CreateTicketDTO } from "../controllers/ticket.controller";

export class TicketRepository implements ITicketRepository {
  async create(data: CreateTicketDTO): Promise<TicketModel | null> {
    const ticket = await database.ticket.create({
      data: {
        title: data.title,
        game: data.game,
        description: data.description,
        urgency: data.urgency,
        status: data.status,
        userId: data.userId,
      },
    });

    if (!ticket) {
      return null;
    }

    return this.mapperToModel(ticket);
  }

  async getById(id: string): Promise<TicketModel | null> {
    const ticket = await database.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return null;
    }

    return this.mapperToModel(ticket);
  }

  async getTicketComments(ticketId: string): Promise<CommentModel[]> {
    const comments = await database.comment.findMany({
      where: { ticketId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    return comments.map((comment) => this.mapperToComment(comment));
  }

  async getAll(): Promise<TicketModel[]> {
    const tickets = await database.ticket.findMany();

    return tickets.map((ticket) => this.mapperToModel(ticket));
  }

  async addComment(ticketId: string, userId: string, message: string): Promise<CommentModel> {
    const comment = await database.comment.create({
      data: {
        ticketId,
        userId,
        message,
      },
    });

    return this.mapperToComment(comment);
  }

  async delete(ticketId: string): Promise<void> {
    await database.comment.deleteMany({
      where: { ticketId },
    });

    await database.ticket.delete({
      where: { id: ticketId },
    });

    return;
  }

  private mapperToModel(ticketPrisma: TicketPrisma): TicketModel {
    return TicketModel.create(
      ticketPrisma.id,
      ticketPrisma.userId,
      ticketPrisma.title,
      ticketPrisma.game,
      ticketPrisma.description,
      ticketPrisma.urgency,
      ticketPrisma.status,
      ticketPrisma.createdAt,
      ticketPrisma.updatedAt,
    );
  }

  private mapperToComment(comment: { id: string; message: string; createdAt: Date; user?: { username?: string; role?: string } }): CommentModel {
    const author = comment?.user?.username || "Usuário deletado";
    const isAdmin = comment?.user?.role === "ADMIN" || false;

    return CommentModel.create(comment.id, comment.message, author, isAdmin, comment.createdAt);
  }
}
