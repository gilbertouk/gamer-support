export class UserModel {
  private id: string;
  private username: string;
  private email: string;
  private password: string;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(id: string, username: string, email: string, password: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(id: string, username: string, email: string, password: string, createdAt: Date, updatedAt: Date): UserModel {
    return new UserModel(id, username, email, password, createdAt, updatedAt);
  }

  getId(): string {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
