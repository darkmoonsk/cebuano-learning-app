import { prisma } from "@/infrastructure/prisma/client";
import { PasswordResetToken } from "@/domain/entities/password-reset-token";
import {
  CreatePasswordResetTokenInput,
  PasswordResetTokenRepository,
} from "@/domain/repositories/password-reset-token-repository";

export class PrismaPasswordResetTokenRepository
  implements PasswordResetTokenRepository
{
  async create(data: CreatePasswordResetTokenInput) {
    const record = await prisma.passwordResetToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt: data.expiresAt,
      },
    });
    return this.toDomain(record);
  }

  async findByToken(token: string) {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
    });
    return record ? this.toDomain(record) : null;
  }

  async deleteById(id: string) {
    await prisma.passwordResetToken.delete({ where: { id } });
  }

  async deleteAllForUser(userId: string) {
    await prisma.passwordResetToken.deleteMany({ where: { userId } });
  }

  private toDomain(record: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
  }) {
    return new PasswordResetToken({
      id: record.id,
      userId: record.userId,
      token: record.token,
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
    });
  }
}
