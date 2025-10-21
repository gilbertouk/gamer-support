/*
 * Types
 */
import type { NextFunction, Request, Response } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err);
  }

  if ("statusCode" in err) {
    const statusCode = err.statusCode as number;
    const message = err.message || "An error occurred";
    res.status(statusCode).json({ message });
    return;
  }

  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
  return;
}
