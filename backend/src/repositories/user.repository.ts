/*
 * Custom Modules
 */
import { UserModel } from "../models/user.model";
import database from "./prisma";

/*
 * Types
 */
import type { CreateUserDTO } from "../controllers/auth.controller";
import type { IUserRepository } from "./interfaces";
import type { UserPrisma } from "./prisma";

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<UserModel | null> {
    const user = await database.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.password,
      },
    });

    if (!user) {
      return null;
    }

    return this.mapperToModel(user);
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await database.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return this.mapperToModel(user);
  }

  async findByUsername(username: string): Promise<UserModel | null> {
    const user = await database.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return null;
    }

    return this.mapperToModel(user);
  }

  private mapperToModel(user: UserPrisma): UserModel {
    return UserModel.create(user.id, user.username, user.email, user.password, user.createdAt, user.updatedAt);
  }
}
