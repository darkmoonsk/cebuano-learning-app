import { PasswordResetToken } from "@/domain/entities/password-reset-token";

export interface CreatePasswordResetTokenInput {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface PasswordResetTokenRepository {
  create(data: CreatePasswordResetTokenInput): Promise<PasswordResetToken>;
  findByToken(token: string): Promise<PasswordResetToken | null>;
  deleteById(id: string): Promise<void>;
  deleteAllForUser(userId: string): Promise<void>;
}
