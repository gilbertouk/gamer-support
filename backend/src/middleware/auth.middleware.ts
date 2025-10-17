/*
 * Types
 */
import type { NextFunction, Request, Response } from "express";
import type { ITokenService } from "../services/interfaces";
import type { IUserRepository } from "../repositories/interfaces";

export interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

// Helper para type casting
export function asAuthenticatedRequest(req: Request): AuthenticatedRequest {
  return req as AuthenticatedRequest;
}

export class AuthMiddleware {
  constructor(
    private tokenService: ITokenService,
    private userRepository: IUserRepository,
  ) {}

  validateAuthHeader(req: Request): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized");
    }
  }

  // Middleware to authenticate user
  authenticate() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        this.validateAuthHeader(req);

        const token = req.headers.authorization!.split(" ")[1];
        const payload = this.tokenService.verifyToken(token);

        if (!payload || typeof payload === "string" || !payload.id || !payload.email || !payload.role) {
          throw new Error("Unauthorized");
        }

        const user = await this.userRepository.findById(payload.id);
        if (!user) {
          throw new Error("Unauthorized");
        }

        // Attach user to request object
        (req as AuthenticatedRequest).user = {
          id: user.getId(),
          email: user.getEmail(),
          role: user.getRole(),
        };

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  requireRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const authenticatedReq = req as AuthenticatedRequest;

      if (!authenticatedReq.user) {
        throw new Error("Unauthorized");
      }

      if (!allowedRoles.includes(authenticatedReq.user.role)) {
        next(new Error("Forbidden"));
        return;
      }

      next();
    };
  }
}
