/*
 * Node Modules
 */
import express from "express";

/*
 * Custom Modules
 */
import { config } from "../../config";
import { AuthController } from "../../controllers/auth.controller";
import { AuthService } from "../../services/auth.service";
import { HashService } from "../../libs/bcrypt";
import { TokenService } from "../../libs/jsonwebtoken";
import { UserRepository } from "../../repositories/user.repository";
import { SessionRepository } from "../../repositories/session.repository";
import { AuthMiddleware, asAuthenticatedRequest } from "../../middleware/auth.middleware";

/*
 * Types
 */
import type { Request, Response } from "express";

const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();

const hashService = new HashService();
const tokenService = new TokenService(sessionRepository);
const authService = new AuthService(userRepository, hashService);
const authController = new AuthController(authService, tokenService);

const authMiddleware = new AuthMiddleware(tokenService, userRepository);

const router = express.Router();

router.post("/sign-up", async (req: Request, res: Response) => {
  const result = await authController.signUp(req.body);
  if (!result) {
    return res.status(400).json({ message: "Error creating user" });
  }

  res.cookie("refreshToken", result.meta?.refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  delete result.meta?.refreshToken;

  return res.status(201).json(result);
});

router.post("/sign-in", async (req: Request, res: Response) => {
  const result = await authController.signIn(req.body);
  if (!result) {
    return res.status(400).json({ message: "Error signing in" });
  }

  res.cookie("refreshToken", result.meta?.refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  delete result.meta?.refreshToken;

  return res.status(200).json(result);
});

router.get("/logout", authMiddleware.authenticate(), async (req: Request, res: Response) => {
  const authReq = asAuthenticatedRequest(req);
  const userId = authReq.user.id;

  if (userId) {
    await sessionRepository.deleteByUserId(userId);
  }

  const refreshToken = req?.cookies?.refreshToken || null;
  if (!refreshToken) {
    res.sendStatus(204);
    return;
  }

  res.clearCookie("refreshToken");

  return res.sendStatus(204);
});

router.get("/me", authMiddleware.authenticate(), async (req: Request, res: Response) => {
  const authReq = asAuthenticatedRequest(req);
  const userId = authReq.user.id;

  const result = await authController.me(userId);
  if (!result) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(result.status).json(result);
});

router.get("/refresh-token", async (req: Request, res: Response) => {
  const refreshToken = req?.cookies?.refreshToken || null;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const payload = tokenService.verifyRefreshToken(refreshToken);
  if (!payload || typeof payload === "string" || !payload.id || !payload.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const savedToken = await sessionRepository.findByToken(refreshToken);
  if (!savedToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const newAccessToken = tokenService.generateToken({ id: payload.id, email: payload.email, role: payload.role });

  return res.status(200).json({
    status: 200,
    message: "Tokens refreshed successfully",
    data: {
      accessToken: newAccessToken,
    },
  });
});

export default router;
