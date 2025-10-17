/*
 * Types
 */
import type { STATUS, URGENCY } from "../models/ticket.model";
import type { ITicketService } from "../services/interfaces";
import type { IResponse } from "../shared/http/IResponse";

export interface CreateTicketDTO {
  title: string;
  game: string;
  description: string;
  urgency: URGENCY;
  status: STATUS;
  userId: string;
}

export interface CreatedTicket {
  id: string;
  userId: string;
  title: string;
  game: string;
  description: string;
  urgency: URGENCY;
  status: STATUS;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  game: string;
  description: string;
  urgency: URGENCY;
  status: STATUS;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  message: string;
  createdAt: Date;
}

export class TicketController {
  private ticketService: ITicketService;

  constructor(ticketService: ITicketService) {
    this.ticketService = ticketService;
  }

  async createTicket(input: CreateTicketDTO): Promise<IResponse<CreatedTicket> | null> {
    const createdTicket = await this.ticketService.create(input);
    if (!createdTicket) {
      return null;
    }

    return {
      status: 201,
      message: "Ticket created successfully",
      data: {
        id: createdTicket.getId(),
        userId: createdTicket.getUserId(),
        title: createdTicket.getTitle(),
        game: createdTicket.getGame(),
        description: createdTicket.getDescription(),
        urgency: createdTicket.getUrgency(),
        status: createdTicket.getStatus(),
        createdAt: createdTicket.getCreatedAt(),
        updatedAt: createdTicket.getUpdatedAt(),
      },
    };
  }

  async getTicketById(ticketId: string): Promise<IResponse<Ticket> | null> {
    const ticket = await this.ticketService.getById(ticketId);
    if (!ticket) {
      return null;
    }

    return {
      status: 200,
      message: "Ticket retrieved successfully",
      data: {
        id: ticket.getId(),
        userId: ticket.getUserId(),
        title: ticket.getTitle(),
        game: ticket.getGame(),
        description: ticket.getDescription(),
        urgency: ticket.getUrgency(),
        status: ticket.getStatus(),
        createdAt: ticket.getCreatedAt(),
        updatedAt: ticket.getUpdatedAt(),
        comments: ticket.getComments().map((comment) => ({
          id: comment.getId(),
          message: comment.getMessage(),
          createdAt: comment.getCreatedAt(),
        })),
      },
    };
  }

  async getAllTickets(): Promise<IResponse<Omit<Ticket, "comments">[]>> {
    const tickets = await this.ticketService.getAll();

    return {
      status: 200,
      message: "Tickets retrieved successfully",
      data: tickets.map((ticket) => ({
        id: ticket.getId(),
        userId: ticket.getUserId(),
        title: ticket.getTitle(),
        game: ticket.getGame(),
        description: ticket.getDescription(),
        urgency: ticket.getUrgency(),
        status: ticket.getStatus(),
        createdAt: ticket.getCreatedAt(),
        updatedAt: ticket.getUpdatedAt(),
      })),
    };
  }

  async addCommentToTicket(ticketId: string, userId: string, message: string): Promise<IResponse<Comment> | null> {
    const result = await this.ticketService.addComment(ticketId, userId, message);
    if (!result) {
      return null;
    }

    return {
      status: 201,
      message: "Comment added successfully",
      data: {
        id: result.getId(),
        message: result.getMessage(),
        createdAt: result.getCreatedAt(),
      },
    };
  }

  async deleteTicket(ticketId: string, userId: string): Promise<void> {
    await this.ticketService.delete(ticketId, userId);
  }
}
