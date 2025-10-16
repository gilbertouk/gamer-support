/*
 * Node Modules
 */
import express from "express";
import cors from "cors";
import helmet from "helmet";

/*
 * Custom Modules
 */
import { config } from "./config";

/*
 * Types
 */
import type { Application, Request, Response } from "express";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: config.version,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
    },
  });
});

export default app;
