/*
 * Types
 */
import type { CommentModel } from "./comment.model";

export type URGENCY = "SUAVE" | "MODERADO" | "AGORA" | "APAGA_O_SERVIDOR";
export type STATUS = "ABERTO" | "RESOLVIDO" | "IGNORADO";

export class TicketModel {
  private id: string;
  private userId: string;
  private title: string;
  private game: string;
  private description: string;
  private urgency: URGENCY;
  private status: STATUS;
  private createdAt: Date;
  private updatedAt: Date;
  private comments: CommentModel[] = [];

  private constructor(id: string, userId: string, title: string, game: string, description: string, urgency: URGENCY, status: STATUS, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.game = game;
    this.description = description;
    this.urgency = urgency;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(id: string, userId: string, title: string, game: string, description: string, urgency: URGENCY, status: STATUS, createdAt: Date, updatedAt: Date): TicketModel {
    return new TicketModel(id, userId, title, game, description, urgency, status, createdAt, updatedAt);
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getTitle(): string {
    return this.title;
  }

  getGame(): string {
    return this.game;
  }

  getDescription(): string {
    return this.description;
  }

  getUrgency(): URGENCY {
    return this.urgency;
  }

  getStatus(): STATUS {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getComments(): CommentModel[] {
    return this.comments;
  }

  setComments(comments: CommentModel[]): void {
    this.comments = comments;
  }
}
