export class CommentModel {
  private id: string;
  private message: string;
  private createdAt: Date;

  constructor(id: string, message: string, createdAt: Date) {
    this.id = id;
    this.message = message;
    this.createdAt = createdAt;
  }

  static create(id: string, message: string, createdAt: Date): CommentModel {
    return new CommentModel(id, message, createdAt);
  }

  getId(): string {
    return this.id;
  }

  getMessage(): string {
    return this.message;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
