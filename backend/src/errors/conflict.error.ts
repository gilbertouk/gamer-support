/*
 * Custom Module
 */
import { BaseError } from "./base.error";

export class ConflictError extends BaseError {
  constructor(message: string) {
    super("ConflictError", message, 409);
  }
}
