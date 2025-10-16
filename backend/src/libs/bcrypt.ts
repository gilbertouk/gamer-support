/*
 * Node Modules
 */
import bcrypt from "bcrypt";

/*
 * types
 */
import type { IHashService } from "../services/interfaces";

export class HashService implements IHashService {
  async hash(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  async compare(data: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(data, hashed);
  }
}
