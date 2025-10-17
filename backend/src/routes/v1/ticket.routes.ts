/*
 * Node Modules
 */
import express from "express";

/*
 * Custom Modules
 */
import { TicketController } from "../../controllers/ticket.controller";
import { TicketService } from "../../services/ticket.service";
import { AuthMiddleware, asAuthenticatedRequest } from "../../middleware/auth.middleware";
import { UserRepository } from "../../repositories/user.repository";
import { TokenService } from "../../libs/jsonwebtoken";
import { SessionRepository } from "../../repositories/session.repository";

/*
 * Types
 */
import type { Request, Response } from "express";
import { TicketRepository } from "../../repositories/ticket.repository";

const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();
const sessionRepository = new SessionRepository();

const tokenService = new TokenService(sessionRepository);
const ticketService = new TicketService(ticketRepository);
const ticketController = new TicketController(ticketService);

const authMiddleware = new AuthMiddleware(tokenService, userRepository);

const router = express.Router();

router.post("/", authMiddleware.authenticate(), async (req: Request, res: Response) => {
  const authReq = asAuthenticatedRequest(req);
  const userId = authReq.user.id;

  const result = await ticketController.createTicket({ ...req.body, userId });
  if (!result) {
    return res.status(400).json({ error: "Invalid ticket data" });
  }

  return res.status(result.status).json(result);
});

router.get("/:id", async (req: Request, res: Response) => {
  const ticketId = req.params.id;

  const result = await ticketController.getTicketById(ticketId);
  if (!result) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  return res.status(result.status).json(result);
});

router.get("/", async (req: Request, res: Response) => {
  const result = await ticketController.getAllTickets();
  return res.status(result.status).json(result);
});

router.put("/:id/comments", authMiddleware.authenticate(), async (req: Request, res: Response) => {
  const authReq = asAuthenticatedRequest(req);
  const userId = authReq.user.id;
  const ticketId = req.params.id;
  const { message } = req.body;

  const result = await ticketController.addCommentToTicket(ticketId, userId, message);
  if (!result) {
    return res.status(400).json({ error: "Unable to add comment" });
  }

  return res.status(result.status).json(result);
});

router.delete("/:id", authMiddleware.authenticate(), async (req: Request, res: Response) => {
  const authReq = asAuthenticatedRequest(req);
  const userId = authReq.user.id;
  const ticketId = req.params.id;

  await ticketController.deleteTicket(ticketId, userId);
  return res.sendStatus(204);
});

export default router;
