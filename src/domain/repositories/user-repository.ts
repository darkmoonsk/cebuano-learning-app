import { User, UserId } from "../entities/user";

export interface CreateUserInput {
  email: string;
  hashedPassword: string;
  displayName: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: UserId): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  updatePassword(id: UserId, hashedPassword: string): Promise<void>;
}
