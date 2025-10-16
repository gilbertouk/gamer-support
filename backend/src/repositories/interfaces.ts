/*
 * Types
 */
import type { CreateUserDTO } from "../controllers/auth.controller";
import type { UserModel } from "../models/user.model";

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<UserModel | null>;
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
