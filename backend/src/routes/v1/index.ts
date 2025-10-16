/*
 * Node Modules
 */
import express from "express";

/*
 * Custom Modules
 */
import ticketRoutes from "./ticket.routes";
import authRoutes from "./auth.routes";

const router = express.Router();

router.use("/v1/tickets", ticketRoutes);
router.use("/v1/auth", authRoutes);

export default router;
