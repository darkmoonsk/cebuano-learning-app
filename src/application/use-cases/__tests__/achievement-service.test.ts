import { AchievementService } from "@/domain/services/achievement-service";
import { Achievement } from "@/domain/entities/achievement";

describe("AchievementService", () => {
  let achievementService: AchievementService;

  beforeEach(() => {
    achievementService = new AchievementService();
  });

  describe("checkAndUnlockAchievements", () => {
    it("should unlock first steps achievement when user learns 10 words", () => {
      const stats = {
        totalWordsLearned: 10,
        totalReviews: 10,
        currentStreak: 1,
        perfectReviewStreak: 0,
        reviewTimes: [new Date()],
        lastReviewDate: new Date(),
      };

      const existingAchievements: Achievement[] = [];
      const result = achievementService.checkAndUnlockAchievements(
        "user1",
        stats,
        existingAchievements
      );

      expect(result).toHaveLength(1);
      expect(result[0].definition.id).toBe("first_steps");
      expect(result[0].definition.name).toBe("First Steps");
    });

    it("should not unlock achievements already unlocked", () => {
      const stats = {
        totalWordsLearned: 20,
        totalReviews: 20,
        currentStreak: 1,
        perfectReviewStreak: 0,
        reviewTimes: [new Date()],
        lastReviewDate: new Date(),
      };

      const existingAchievements: Achievement[] = [
        new Achievement({
          id: "achievement1",
          userId: "user1",
          achievementId: "first_steps",
          unlockedAt: new Date(),
          notifiedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const result = achievementService.checkAndUnlockAchievements(
        "user1",
        stats,
        existingAchievements
      );

      // Should only unlock "getting_started" (50 words), not "first_steps" again
      expect(result).toHaveLength(0);
    });

    it("should unlock multiple achievements when criteria are met", () => {
      const stats = {
        totalWordsLearned: 100,
        totalReviews: 100,
        currentStreak: 7,
        perfectReviewStreak: 0,
        reviewTimes: [new Date()],
        lastReviewDate: new Date(),
      };

      const existingAchievements: Achievement[] = [];
      const result = achievementService.checkAndUnlockAchievements(
        "user1",
        stats,
        existingAchievements
      );

      // Should unlock multiple achievements: first_steps, getting_started, building_momentum, streak_master
      expect(result.length).toBeGreaterThan(1);

      const unlockedIds = result.map((r) => r.definition.id);
      expect(unlockedIds).toContain("first_steps");
      expect(unlockedIds).toContain("getting_started");
      expect(unlockedIds).toContain("building_momentum");
      expect(unlockedIds).toContain("streak_master");
    });
  });

  describe("getProgressTowardsAchievement", () => {
    it("should calculate progress correctly for words learned", () => {
      const stats = {
        totalWordsLearned: 25,
        totalReviews: 25,
        currentStreak: 1,
        perfectReviewStreak: 0,
        reviewTimes: [new Date()],
        lastReviewDate: new Date(),
      };

      const definition = {
        id: "getting_started",
        name: "Getting Started",
        description: "Learn 50 words",
        icon: "📚",
        category: "learning" as const,
        criteria: { type: "words_learned" as const, threshold: 50 },
      };

      const progress = achievementService.getProgressTowardsAchievement(
        definition,
        stats
      );

      expect(progress.current).toBe(25);
      expect(progress.target).toBe(50);
      expect(progress.percentage).toBe(50);
    });
  });
});
