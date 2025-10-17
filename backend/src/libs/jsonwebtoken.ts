/*
 * Node Modules
 */
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

/*
 * Custom Modules
 */
import { ITokenService } from "../services/interfaces";
import { config } from "../config";

/*
 * Types
 */
import type { SignOptions } from "jsonwebtoken";
import { ITokenRepository } from "../repositories/interfaces";

interface JwtPayload {
  id: string;
  email: string;
}

export class TokenService implements ITokenService {
  private tokenRepository: ITokenRepository;

  constructor(tokenRepository: ITokenRepository) {
    this.tokenRepository = tokenRepository;
  }

  generateToken(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: config.token.expiresIn, issuer: config.token.issuer } as SignOptions;
    const token = jwt.sign(payload, config.token.secret, options);
    return token;
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, config.token.secret) as JwtPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  generateRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = { expiresIn: config.token.refreshExpiresIn, issuer: config.token.issuer, jwtid: crypto.randomUUID() } as SignOptions;
    const token = jwt.sign(payload, config.token.refreshSecret, options);
    return token;
  }

  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, config.token.refreshSecret) as JwtPayload;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId: string, token: string): Promise<void> {
    await this.tokenRepository.saveRefreshToken(userId, token);
  }

  async getTokenByUserId(userId: string): Promise<string[] | null> {
    return await this.tokenRepository.findByUserId(userId);
  }

  async getToken(token: string): Promise<string | null> {
    return await this.tokenRepository.findByToken(token);
  }

  async deleteTokenByUserId(userId: string): Promise<void> {
    await this.tokenRepository.deleteByUserId(userId);
  }
}
