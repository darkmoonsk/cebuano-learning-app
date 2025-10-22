import { Achievement } from "@/domain/entities/achievement";

export interface CreateAchievementInput {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface AchievementRepository {
  findByUser(userId: string): Promise<Achievement[]>;
  findByUserAndAchievement(
    userId: string,
    achievementId: string
  ): Promise<Achievement | null>;
  create(data: CreateAchievementInput): Promise<Achievement>;
  markAsNotified(id: string): Promise<Achievement>;
  markMultipleAsNotified(ids: string[]): Promise<void>;
}
