/*
 * Custom Module
 */
import { BaseError } from "./base.error";

export class ForbiddenError extends BaseError {
  constructor(message: string) {
    super("ForbiddenError", message, 403);
  }
}
