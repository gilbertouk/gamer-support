/*
 * Types
 */
import type { USER_ROLE, UserModel } from "../models/user.model";
import type { CreateUserDTO, UserSignedInDTO } from "../controllers/auth.controller";
import type { CreateTicketDTO } from "../controllers/ticket.controller";
import type { TicketModel } from "../models/ticket.model";
import type { CommentModel } from "../models/comment.model";

export interface IAuthService {
  signUp(data: CreateUserDTO): Promise<UserModel | null>;
  signIn(data: UserSignedInDTO): Promise<UserModel | null>;
  me(userId: string): Promise<UserModel | null>;
}

export interface ITicketService {
  create(data: CreateTicketDTO): Promise<TicketModel | null>;
  getById(id: string): Promise<TicketModel | null>;
  getAll(): Promise<TicketModel[]>;
  addComment(ticketId: string, userId: string, message: string): Promise<CommentModel>;
  delete(ticketId: string, userId: string): Promise<void>;
}

export interface ITokenService {
  generateToken(payload: { id: string; email: string; role: USER_ROLE }): string;
  verifyToken(token: string): { id: string; email: string; role: USER_ROLE } | null;
  generateRefreshToken(payload: { id: string; email: string; role: USER_ROLE }): string;
  verifyRefreshToken(token: string): { id: string; email: string; role: USER_ROLE } | null;
  saveToken(userId: string, token: string): Promise<void>;
  getTokenByUserId(userId: string): Promise<string[] | null>;
  getToken(token: string): Promise<string | null>;
  deleteTokenByUserId(userId: string): Promise<void>;
}

export interface IHashService {
  hash(data: string): Promise<string>;
  compare(data: string, hashed: string): Promise<boolean>;
}
