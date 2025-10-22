import { prisma } from "@/infrastructure/prisma/client";
import {
  CreateUserInput,
  UserRepository,
} from "@/domain/repositories/user-repository";
import { User } from "@/domain/entities/user";
import {
  normalizeUserSettings,
  UserSettings,
} from "@/domain/value-objects/user-settings";

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string) {
    const record = await prisma.user.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async findById(id: string) {
    const record = await prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async create(data: CreateUserInput) {
    const record = await prisma.user.create({
      data,
    });
    return this.toDomain(record);
  }

  async updatePassword(id: string, hashedPassword: string) {
    await prisma.user.update({
      where: { id },
      data: { hashedPassword },
    });
  }

  async getSettings(id: string): Promise<UserSettings> {
    const record = await prisma.user.findUnique({
      where: { id },
      select: { settings: true },
    });
    return normalizeUserSettings(
      (record as { settings?: unknown } | null)?.settings as
        | Partial<UserSettings>
        | null
        | undefined
    );
  }

  async updateSettings(id: string, settings: UserSettings): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { settings: settings as any },
    });
  }

  private toDomain(record: {
    id: string;
    email: string;
    hashedPassword: string;
    displayName: string;
    settings?: unknown;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new User({
      id: record.id,
      email: record.email,
      hashedPassword: record.hashedPassword,
      displayName: record.displayName,
      settings: record.settings ?? {},
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
