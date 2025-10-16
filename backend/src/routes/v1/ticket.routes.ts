/*
 * Node Modules
 */
import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  res.status(201).json({ message: "Ticket created" });
});

export default router;
