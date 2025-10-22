import { AchievementRepository } from "@/domain/repositories/achievement-repository";
import { AchievementService } from "@/domain/services/achievement-service";
import { ACHIEVEMENT_DEFINITIONS } from "@/domain/value-objects/achievement-definition";

export interface GetUserAchievementsInput {
  userId: string;
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
  notifiedAt?: Date | null;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
}

export class GetUserAchievementsUseCase {
  constructor(
    private readonly achievementRepository: AchievementRepository,
    private readonly achievementService: AchievementService
  ) {}

  async execute(input: GetUserAchievementsInput): Promise<UserAchievement[]> {
    const [existingAchievements, stats] = await Promise.all([
      this.achievementRepository.findByUser(input.userId),
      this.getAchievementStats(input.userId),
    ]);

    const unlockedAchievements =
      this.achievementService.getUnlockedAchievements(existingAchievements);
    const unlockedAchievementIds = new Set(
      unlockedAchievements.map((a) => a.definition.id)
    );

    return ACHIEVEMENT_DEFINITIONS.map((definition) => {
      const unlockedAchievement = unlockedAchievements.find(
        (a) => a.definition.id === definition.id
      );
      const isUnlocked = !!unlockedAchievement;

      let progress:
        | { current: number; target: number; percentage: number }
        | undefined;
      if (!isUnlocked) {
        progress = this.achievementService.getProgressTowardsAchievement(
          definition,
          stats
        );
      }

      return {
        id: definition.id,
        name: definition.name,
        description: definition.description,
        icon: definition.icon,
        category: definition.category,
        isUnlocked,
        unlockedAt: unlockedAchievement?.unlockedAt,
        notifiedAt: unlockedAchievement?.notifiedAt,
        progress,
      };
    });
  }

  private async getAchievementStats(userId: string) {
    // This would typically come from the review repository
    // For now, we'll return a basic structure
    // In a real implementation, this would call the review repository's getAchievementStats method
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
