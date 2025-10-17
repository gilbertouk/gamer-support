/*
 * Types
 */
import type { NextFunction, Request, Response } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
  return;
}
