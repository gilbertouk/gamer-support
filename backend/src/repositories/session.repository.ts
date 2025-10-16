/*
 * Custom Modules
 */
import database from "./prisma";

/*
 * Types
 */
import type { ITokenRepository } from "./interfaces";

export class SessionRepository implements ITokenRepository {
  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await database.session.create({
      data: {
        userId,
        token: refreshToken,
      },
    });
  }

  async findByToken(refreshToken: string): Promise<string | null> {
    const session = await database.session.findUnique({
      where: {
        token: refreshToken,
      },
    });
    return session ? session.userId : null;
  }

  async findByUserId(userId: string): Promise<string[] | null> {
    const sessions = await database.session.findMany({
      where: {
        userId,
      },
    });
    return sessions.length > 0 ? sessions.map((session) => session.token) : null;
  }

  async deleteByToken(refreshToken: string): Promise<void> {
    await database.session.deleteMany({
      where: {
        token: refreshToken,
      },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await database.session.deleteMany({
      where: {
        userId,
      },
    });
  }
}
