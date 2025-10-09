import { prisma } from "@/infrastructure/prisma/client";
import {
  CreateUserInput,
  UserRepository,
} from "@/domain/repositories/user-repository";
import { User } from "@/domain/entities/user";

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

  private toDomain(record: {
    id: string;
    email: string;
    hashedPassword: string;
    displayName: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new User({
      id: record.id,
      email: record.email,
      hashedPassword: record.hashedPassword,
      displayName: record.displayName,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
