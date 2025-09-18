import bcrypt from "bcryptjs";
import { PasswordHasher } from "@/application/services/password-hasher";

const SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(raw: string) {
    return bcrypt.hash(raw, SALT_ROUNDS);
  }

  async compare(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
  }
}
