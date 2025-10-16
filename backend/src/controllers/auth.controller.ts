/*
 * Custom Modules
 */

/*
 * Types
 */
import type { IAuthService, ITokenService } from "../services/interfaces";
import type { IResponse } from "./../shared/http/IResponse";

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
}

export interface UserCreated {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export class AuthController {
  private authService: IAuthService;
  private tokenService: ITokenService;

  constructor(authService: IAuthService, tokenService: ITokenService) {
    this.authService = authService;
    this.tokenService = tokenService;
  }

  async signUp(input: CreateUserDTO): Promise<IResponse<UserCreated> | null> {
    const user = await this.authService.signUp(input);

    if (!user) {
      return null;
    }

    const accessToken = this.tokenService.generateToken({ id: user.getId() });
    const refreshToken = this.tokenService.generateRefreshToken({ id: user.getId() });

    await this.tokenService.saveToken(user.getId(), refreshToken);

    return {
      status: 201,
      message: "User signed up successfully",
      data: {
        id: user.getId(),
        username: user.getUsername(),
        email: user.getEmail(),
        createdAt: user.getCreatedAt(),
      },
      meta: {
        accessToken,
        refreshToken,
      },
    };
  }
}
