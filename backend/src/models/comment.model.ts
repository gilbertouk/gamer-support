export class CommentModel {
  private id: string;
  private message: string;
  private author: string;
  private isAdmin: boolean;
  private createdAt: Date;

  constructor(id: string, message: string, author: string, isAdmin: boolean, createdAt: Date) {
    this.id = id;
    this.message = message;
    this.author = author;
    this.isAdmin = isAdmin;
    this.createdAt = createdAt;
  }

  static create(id: string, message: string, author: string, isAdmin: boolean, createdAt: Date): CommentModel {
    return new CommentModel(id, message, author, isAdmin, createdAt);
  }

  getId(): string {
    return this.id;
  }

  getMessage(): string {
    return this.message;
  }

  getAuthor(): string {
    return this.author;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
