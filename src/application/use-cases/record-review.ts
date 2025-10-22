import { SpacedRepetitionService } from "@/domain/services/spaced-repetition";
import { Difficulty } from "@/domain/value-objects/difficulty-rating";
import { ReviewRepository } from "@/domain/repositories/review-repository";
import { UserRepository } from "@/domain/repositories/user-repository";
import { CheckAchievementsUseCase } from "./check-achievements";

export interface RecordReviewInput {
  userId: string;
  flashcardId: string;
  rating: Difficulty;
  /** Daily review cap (total reviews) */
  dailyReviewCap?: number;
}

export interface RecordReviewOutput {
  reviewState: {
    id: string;
    userId: string;
    flashcardId: string;
    easeFactor: number;
    interval: number;
    repetitions: number;
    due: Date;
    lastReviewedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  newlyUnlockedAchievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    unlockedAt: Date;
  }>;
}

export class RecordReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly spacedRepetitionService: SpacedRepetitionService,
    private readonly userRepository: UserRepository,
    private readonly checkAchievementsUseCase: CheckAchievementsUseCase
  ) {}

  async execute(input: RecordReviewInput): Promise<RecordReviewOutput> {
    const now = new Date();
    const dailyCap = input.dailyReviewCap ?? 300;
    const reviewsToday = await this.reviewRepository.countReviewsOnDate(
      input.userId,
      now
    );
    if (reviewsToday >= dailyCap) {
      throw new Error("Daily review limit reached");
    }
    const existing = await this.reviewRepository.findByUserAndFlashcard(
      input.userId,
      input.flashcardId
    );

    let reviewState;

    if (!existing) {
      const schedule = this.spacedRepetitionService.initialSchedule(
        input.rating,
        now
      );
      reviewState = await this.reviewRepository.create(
        {
          userId: input.userId,
          flashcardId: input.flashcardId,
          easeFactor: schedule.easeFactor,
          interval: schedule.interval,
          repetitions: schedule.repetitions,
          due: schedule.due,
          lastReviewedAt: now,
        },
        input.rating
      );
      const rank = Number(input.flashcardId);
      if (Number.isFinite(rank)) {
        const current = await this.userRepository.getSettings(input.userId);
        if (rank > current.lastLearnedRank) {
          await this.userRepository.updateSettings(input.userId, {
            ...current,
            lastLearnedRank: rank,
          });
        }
      }
    } else {
      const schedule = this.spacedRepetitionService.scheduleNext(
        existing,
        input.rating,
        now
      );

      reviewState = await this.reviewRepository.update(
        existing.id,
        {
          easeFactor: schedule.easeFactor,
          interval: schedule.interval,
          repetitions: schedule.repetitions,
          due: schedule.due,
          lastReviewedAt: now,
        },
        input.rating
      );
    }

    // Check for newly unlocked achievements
    const newlyUnlockedAchievements =
      await this.checkAchievementsUseCase.execute({
        userId: input.userId,
      });

    return {
      reviewState,
      newlyUnlockedAchievements,
    };
  }
}
