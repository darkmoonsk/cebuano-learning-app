import { User, UserId } from "../entities/user";
import { UserSettings } from "../value-objects/user-settings";

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
  getSettings(id: UserId): Promise<UserSettings>;
  updateSettings(id: UserId, settings: UserSettings): Promise<void>;
}
