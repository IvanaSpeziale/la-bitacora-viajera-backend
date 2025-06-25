import { User } from "@/domain/entities/User";

declare global {
  namespace Express {
    interface Request extends RequestBasic {
      user?: User & {
        id: string;
      };
    }
  }
}
