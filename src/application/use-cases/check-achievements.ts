import { AchievementRepository } from "@/domain/repositories/achievement-repository";
import {
  AchievementService,
  AchievementStats,
} from "@/domain/services/achievement-service";
import { ReviewRepository } from "@/domain/repositories/review-repository";

export interface CheckAchievementsInput {
  userId: string;
}

export interface NewlyUnlockedAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: Date;
}

export class CheckAchievementsUseCase {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly achievementService: AchievementService,
    private readonly reviewRepository: ReviewRepository
  ) {}

  async execute(
    input: CheckAchievementsInput
  ): Promise<NewlyUnlockedAchievement[]> {
    const [existingAchievements, stats] = await Promise.all([
      this.achievementRepository.findByUser(input.userId),
      this.getAchievementStats(input.userId),
    ]);

    const newlyUnlocked = this.achievementService.checkAndUnlockAchievements(
      input.userId,
      stats,
      existingAchievements
    );

    // Create achievement records for newly unlocked achievements
    const createdAchievements = await Promise.all(
      newlyUnlocked.map((unlocked) =>
        this.achievementRepository.create({
          userId: input.userId,
          achievementId: unlocked.definition.id,
          unlockedAt: unlocked.unlockedAt,
        })
      )
    );

    return newlyUnlocked.map((unlocked) => ({
      id: unlocked.definition.id,
      name: unlocked.definition.name,
      description: unlocked.definition.description,
      icon: unlocked.definition.icon,
      category: unlocked.definition.category,
      unlockedAt: unlocked.unlockedAt,
    }));
  }

  private async getAchievementStats(userId: string): Promise<AchievementStats> {
    // This would call the review repository's getAchievementStats method
    // For now, we'll return a basic structure
    return {
      totalWordsLearned: 0,
      totalReviews: 0,
      currentStreak: 0,
      perfectReviewStreak: 0,
      reviewTimes: [],
      lastReviewDate: null,
    };
  }
}
