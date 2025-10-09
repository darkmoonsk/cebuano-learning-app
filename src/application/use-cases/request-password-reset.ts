import crypto from "crypto";
import { z } from "zod";
import { UserRepository } from "@/domain/repositories/user-repository";
import { PasswordResetTokenRepository } from "@/domain/repositories/password-reset-token-repository";

const inputSchema = z.object({
  email: z.string().email(),
});

export interface RequestPasswordResetDeps {
  userRepository: UserRepository;
  tokenRepository: PasswordResetTokenRepository;
  tokenTtlMs?: number;
}

export class RequestPasswordResetUseCase {
  private readonly tokenTtlMs: number;

  constructor(private readonly deps: RequestPasswordResetDeps) {
    this.tokenTtlMs = deps.tokenTtlMs ?? 1000 * 60 * 30; // 30 minutes
  }

  async execute(raw: unknown): Promise<{ token: string } | { ok: true }> {
    const { email } = inputSchema.parse(raw);
    const user = await this.deps.userRepository.findByEmail(
      email.toLowerCase()
    );

    // Return generic response for non-existent users (no account enumeration)
    if (!user) {
      return { ok: true };
    }

    // Invalidate previous tokens for this user
    await this.deps.tokenRepository.deleteAllForUser(user.id);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + this.tokenTtlMs);

    await this.deps.tokenRepository.create({
      userId: user.id,
      token,
      expiresAt,
    });

    // In a real app we would send email here; return token so API layer can email or test
    return { token };
  }
}
