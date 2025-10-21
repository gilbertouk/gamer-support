/*
 * Custom Module
 */
import { BaseError } from "./base.error";

export class UnauthorizedError extends BaseError {
  constructor(message: string) {
    super("UnauthorizedError", message, 401);
  }
}
