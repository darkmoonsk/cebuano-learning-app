import { z } from "zod";
import { PasswordHasher } from "@/application/services/password-hasher";
import { UserRepository } from "@/domain/repositories/user-repository";
import { PasswordResetTokenRepository } from "@/domain/repositories/password-reset-token-repository";

const inputSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: PasswordResetTokenRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(raw: unknown): Promise<{ ok: true }> {
    const { token, newPassword } = inputSchema.parse(raw);

    const tokenRecord = await this.tokenRepository.findByToken(token);
    if (!tokenRecord || tokenRecord.isExpired()) {
      throw new Error("Invalid or expired token");
    }

    const hashedPassword = await this.passwordHasher.hash(newPassword);
    await this.userRepository.updatePassword(
      tokenRecord.userId,
      hashedPassword
    );

    // Consume token
    await this.tokenRepository.deleteById(tokenRecord.id);

    return { ok: true };
  }
}
