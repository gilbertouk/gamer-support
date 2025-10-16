/*
 * Types
 */
import type { IAuthService, IHashService } from "./interfaces";
import type { CreateUserDTO } from "../controllers/auth.controller";
import type { UserModel } from "../models/user.model";
import type { IUserRepository } from "../repositories/interfaces";

export class AuthService implements IAuthService {
  private userRepository: IUserRepository;
  private hashService: IHashService;

  constructor(userRepository: IUserRepository, hashService: IHashService) {
    this.userRepository = userRepository;
    this.hashService = hashService;
  }

  async signUp(data: CreateUserDTO): Promise<UserModel | null> {
    const emailExists = await this.userRepository.findByEmail(data.email);

    if (emailExists) {
      throw new Error("Email already in use");
    }

    const usernameExists = await this.userRepository.findByUsername(data.username);
    if (usernameExists) {
      throw new Error("Username already in use");
    }

    const hashedPassword = await this.hashService.hash(data.password);

    const user = await this.userRepository.create({ ...data, password: hashedPassword });
    return user;
  }
}
