/*
 * Types
 */
import type { UserModel } from "../models/user.model";
import type { CreateUserDTO } from "../controllers/auth.controller";
import type { CreatedTicket, CreateTicketDTO } from "../controllers/ticket.controller";

export interface IAuthService {
  signUp(data: CreateUserDTO): Promise<UserModel | null>;
}

export interface ITicketService {
  create(data: CreateTicketDTO): Promise<CreatedTicket>;
}

export interface ITokenService {
  generateToken(payload: object): string;
  verifyToken(token: string): object | null;
  generateRefreshToken(payload: object): string;
  verifyRefreshToken(token: string): object | null;
  saveToken(userId: string, token: string): Promise<void>;
  getTokenByUserId(userId: string): Promise<string[] | null>;
  getToken(token: string): Promise<string | null>;
  deleteTokenByUserId(userId: string): Promise<void>;
}

export interface IHashService {
  hash(data: string): Promise<string>;
  compare(data: string, hashed: string): Promise<boolean>;
}
