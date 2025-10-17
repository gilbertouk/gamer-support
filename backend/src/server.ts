/*
 * Node Modules
 */
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

/*
 * Custom Modules
 */
import { config } from "./config";
// routes
import v1 from "./routes/v1";

/*
 * Types
 */
import type { Application, NextFunction, Request, Response } from "express";

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req: Request, res: Response) => {
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

app.use("/api", v1);

app.use(errorHandler);

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
  return;
}

export default app;
