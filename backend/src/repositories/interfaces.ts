/*
 * Types
 */
import type { CreateUserDTO } from "../controllers/auth.controller";
import type { CreateTicketDTO } from "../controllers/ticket.controller";
import type { CommentModel } from "../models/comment.model";
import type { TicketModel } from "../models/ticket.model";
import type { UserModel } from "../models/user.model";

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<UserModel | null>;
  findById(id: string): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  findByUsername(username: string): Promise<UserModel | null>;
}

export interface ITokenRepository {
  saveRefreshToken(userId: string, refreshToken: string): Promise<void>;
  findByToken(refreshToken: string): Promise<string | null>;
  findByUserId(userId: string): Promise<string[] | null>;
  deleteByToken(refreshToken: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}

export interface ITicketRepository {
  create(data: CreateTicketDTO): Promise<TicketModel | null>;
  getById(id: string): Promise<TicketModel | null>;
  getAll(): Promise<TicketModel[]>;
  getTicketComments(ticketId: string): Promise<CommentModel[]>;
  addComment(ticketId: string, userId: string, message: string): Promise<CommentModel>;
  delete(ticketId: string): Promise<void>;
}
