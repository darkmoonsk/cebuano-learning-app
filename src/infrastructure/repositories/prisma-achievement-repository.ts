import { prisma } from "@/infrastructure/prisma/client";
import { Achievement } from "@/domain/entities/achievement";
import {
  AchievementRepository,
  CreateAchievementInput,
} from "@/domain/repositories/achievement-repository";

export class PrismaAchievementRepository implements AchievementRepository {
  async findByUser(userId: string): Promise<Achievement[]> {
    const records = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: "desc" },
    });

    return records.map((record) => this.toDomain(record));
  }

  async findByUserAndAchievement(
    userId: string,
    achievementId: string
  ): Promise<Achievement | null> {
    const record = await prisma.achievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });

    return record ? this.toDomain(record) : null;
  }

  async create(data: CreateAchievementInput): Promise<Achievement> {
    const record = await prisma.achievement.create({
      data: {
        userId: data.userId,
        achievementId: data.achievementId,
        unlockedAt: data.unlockedAt,
      },
    });

    return this.toDomain(record);
  }

  async markAsNotified(id: string): Promise<Achievement> {
    const record = await prisma.achievement.update({
      where: { id },
      data: { notifiedAt: new Date() },
    });

    return this.toDomain(record);
  }

  async markMultipleAsNotified(ids: string[]): Promise<void> {
    await prisma.achievement.updateMany({
      where: { id: { in: ids } },
      data: { notifiedAt: new Date() },
    });
  }

  private toDomain(record: {
    id: string;
    userId: string;
    achievementId: string;
    unlockedAt: Date;
    notifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Achievement {
    return new Achievement({
      id: record.id,
      userId: record.userId,
      achievementId: record.achievementId,
      unlockedAt: record.unlockedAt,
      notifiedAt: record.notifiedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
