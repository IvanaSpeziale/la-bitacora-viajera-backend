import { LoginRequestDTO } from "../../../domain/dtos/LoginRequestDTO";
import { AuthRepository } from "../../../domain/repositories/AuthRepository";
export class LoginUser {
  constructor(private authRepo: AuthRepository) {}

  async execute(email: string, password: string): Promise<string | null> {
    const loginRequest = new LoginRequestDTO(email, password);
    return this.authRepo.login(loginRequest);
  }
}
