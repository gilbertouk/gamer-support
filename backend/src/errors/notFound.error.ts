/*
 * Custom Module
 */
import { BaseError } from "./base.error";

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super("NotFoundError", message, 404);
  }
}
