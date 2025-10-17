/*
 * Custom Modules
 */

/*
 * Types
 */
import type { CreateTicketDTO } from "../controllers/ticket.controller";
import type { CommentModel } from "../models/comment.model";
import type { TicketModel } from "../models/ticket.model";
import type { ITicketRepository } from "../repositories/interfaces";
import type { ITicketService } from "./interfaces";

export class TicketService implements ITicketService {
  private ticketRepository: ITicketRepository;

  constructor(ticketRepository: ITicketRepository) {
    this.ticketRepository = ticketRepository;
  }

  async create(data: CreateTicketDTO): Promise<TicketModel | null> {
    return await this.ticketRepository.create(data);
  }

  async getById(id: string): Promise<TicketModel | null> {
    const ticket = await this.ticketRepository.getById(id);
    if (!ticket) {
      return null;
    }

    const comments = await this.ticketRepository.getTicketComments(id);
    ticket.setComments(comments);

    return ticket;
  }

  async getAll(): Promise<TicketModel[]> {
    return await this.ticketRepository.getAll();
  }

  async addComment(ticketId: string, userId: string, message: string): Promise<CommentModel> {
    return await this.ticketRepository.addComment(ticketId, userId, message);
  }

  async delete(ticketId: string, userId: string): Promise<void> {
    const ticket = await this.ticketRepository.getById(ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    if (ticket.getUserId() !== userId) {
      throw new Error("Unauthorized");
    }

    await this.ticketRepository.delete(ticketId);
  }
}
