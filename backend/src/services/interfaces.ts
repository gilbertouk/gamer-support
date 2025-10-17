/*
 * Types
 */
import type { UserModel } from "../models/user.model";
import type { CreateUserDTO, UserSignedInDTO } from "../controllers/auth.controller";
import type { CreatedTicket, CreateTicketDTO } from "../controllers/ticket.controller";

export interface IAuthService {
  signUp(data: CreateUserDTO): Promise<UserModel | null>;
  signIn(data: UserSignedInDTO): Promise<UserModel | null>;
  me(userId: string): Promise<UserModel | null>;
}

export interface ITicketService {
  create(data: CreateTicketDTO): Promise<CreatedTicket>;
}

export interface ITokenService {
  generateToken(payload: { id: string; email: string }): string;
  verifyToken(token: string): { id: string; email: string } | null;
  generateRefreshToken(payload: { id: string; email: string }): string;
  verifyRefreshToken(token: string): { id: string; email: string } | null;
  saveToken(userId: string, token: string): Promise<void>;
  getTokenByUserId(userId: string): Promise<string[] | null>;
  getToken(token: string): Promise<string | null>;
  deleteTokenByUserId(userId: string): Promise<void>;
}

export interface IHashService {
  hash(data: string): Promise<string>;
  compare(data: string, hashed: string): Promise<boolean>;
}
