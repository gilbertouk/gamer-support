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

const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();

const hashService = new HashService();
const tokenService = new TokenService(sessionRepository);
const authService = new AuthService(userRepository, hashService);
const authController = new AuthController(authService, tokenService);

const router = express.Router();

router.post("/sign-up", async (req, res) => {
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

  res.status(201).json(result);
});

export default router;
