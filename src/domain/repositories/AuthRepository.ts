import { LoginRequestDTO } from "../dtos/LoginRequestDTO";
import { User } from "../entities/User";
export interface AuthRepository {
  login(request: LoginRequestDTO): Promise<string | null>; // Cambia para aceptar un objeto
  signup(user: User): Promise<string>;
  getUserById(id: string): Promise<User | null>;
}
