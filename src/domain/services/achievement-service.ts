import {
  AchievementDefinition,
  ACHIEVEMENT_DEFINITIONS,
} from "@/domain/value-objects/achievement-definition";
import { Achievement } from "@/domain/entities/achievement";

export interface AchievementStats {
  totalWordsLearned: number;
  totalReviews: number;
  currentStreak: number;
  perfectReviewStreak: number;
  reviewTimes: Date[];
  lastReviewDate: Date | null;
}

export interface UnlockedAchievement {
  definition: AchievementDefinition;
  unlockedAt: Date;
}

export class AchievementService {
  checkAndUnlockAchievements(
    userId: string,
    stats: AchievementStats,
    existingAchievements: Achievement[]
  ): UnlockedAchievement[] {
    const unlockedAchievementIds = new Set(
      existingAchievements.map((a) => a.achievementId)
    );
    const newlyUnlocked: UnlockedAchievement[] = [];

    for (const definition of ACHIEVEMENT_DEFINITIONS) {
      if (unlockedAchievementIds.has(definition.id)) {
        continue; // Already unlocked
      }

      if (this.evaluateCriteria(definition, stats)) {
        newlyUnlocked.push({
          definition,
          unlockedAt: new Date(),
        });
      }
    }

    return newlyUnlocked;
  }

  getUnlockedAchievements(
    existingAchievements: Achievement[]
  ): {
    definition: AchievementDefinition;
    unlockedAt: Date;
    notifiedAt: Date | null;
  }[] {
    return existingAchievements.map((achievement) => {
      const definition = ACHIEVEMENT_DEFINITIONS.find(
        (d) => d.id === achievement.achievementId
      );
      if (!definition) {
        throw new Error(
          `Achievement definition not found for ID: ${achievement.achievementId}`
        );
      }

      return {
        definition,
        unlockedAt: achievement.unlockedAt,
        notifiedAt: achievement.notifiedAt,
      };
    });
  }

  private evaluateCriteria(
    definition: AchievementDefinition,
    stats: AchievementStats
  ): boolean {
    const { criteria } = definition;

    switch (criteria.type) {
      case "words_learned":
        return stats.totalWordsLearned >= criteria.threshold;

      case "total_reviews":
        return stats.totalReviews >= criteria.threshold;

      case "perfect_reviews":
        return stats.perfectReviewStreak >= criteria.threshold;

      case "streak_days":
        return stats.currentStreak >= criteria.threshold;

      case "review_time":
        return this.evaluateTimeBasedCriteria(criteria, stats);

      default:
        return false;
    }
  }

  private evaluateTimeBasedCriteria(
    criteria: {
      threshold: number;
      timeOfDay?: "early_morning" | "late_night" | "weekend";
    },
    stats: AchievementStats
  ): boolean {
    if (!criteria.timeOfDay || stats.reviewTimes.length === 0) {
      return false;
    }

    const now = new Date();
    const recentReviews = stats.reviewTimes.filter((time) => {
      const daysDiff = Math.floor(
        (now.getTime() - time.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 7; // Check last 7 days
    });

    switch (criteria.timeOfDay) {
      case "early_morning":
        return recentReviews.some((time) => time.getHours() < 8);

      case "late_night":
        return recentReviews.some((time) => time.getHours() >= 22);

      case "weekend":
        return recentReviews.some((time) => {
          const dayOfWeek = time.getDay();
          return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
        });

      default:
        return false;
    }
  }

  getProgressTowardsAchievement(
    definition: AchievementDefinition,
    stats: AchievementStats
  ): { current: number; target: number; percentage: number } {
    const { criteria } = definition;
    let current = 0;

    switch (criteria.type) {
      case "words_learned":
        current = stats.totalWordsLearned;
        break;
      case "total_reviews":
        current = stats.totalReviews;
        break;
      case "perfect_reviews":
        current = stats.perfectReviewStreak;
        break;
      case "streak_days":
        current = stats.currentStreak;
        break;
      case "review_time":
        current = this.getTimeBasedProgress(criteria, stats);
        break;
    }

    const target = criteria.threshold;
    const percentage = Math.min(100, Math.round((current / target) * 100));

    return { current, target, percentage };
  }

  private getTimeBasedProgress(
    criteria: {
      threshold: number;
      timeOfDay?: "early_morning" | "late_night" | "weekend";
    },
    stats: AchievementStats
  ): number {
    if (!criteria.timeOfDay || stats.reviewTimes.length === 0) {
      return 0;
    }

    const now = new Date();
    const recentReviews = stats.reviewTimes.filter((time) => {
      const daysDiff = Math.floor(
        (now.getTime() - time.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff <= 7;
    });

    let matchingReviews = 0;

    switch (criteria.timeOfDay) {
      case "early_morning":
        matchingReviews = recentReviews.filter(
          (time) => time.getHours() < 8
        ).length;
        break;
      case "late_night":
        matchingReviews = recentReviews.filter(
          (time) => time.getHours() >= 22
        ).length;
        break;
      case "weekend":
        matchingReviews = recentReviews.filter((time) => {
          const dayOfWeek = time.getDay();
          return dayOfWeek === 0 || dayOfWeek === 6;
        }).length;
        break;
    }

    return matchingReviews;
  }
}
