import {
  PhraseReviewRepository,
  PhraseReviewState,
} from "@/domain/repositories/phrase-review-repository";
import { SpacedRepetitionService } from "@/domain/services/spaced-repetition";
import { UserRepository } from "@/domain/repositories/user-repository";
import { CheckAchievementsUseCase } from "@/application/use-cases/check-achievements";
import { Difficulty } from "@/domain/value-objects/difficulty-rating";

export interface RecordPhraseReviewInput {
  userId: string;
  phraseId: string;
  rating: Difficulty;
  dailyReviewCap?: number;
}

export interface RecordPhraseReviewOutput {
  reviewState: PhraseReviewState;
  newlyUnlockedAchievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    unlockedAt: Date;
  }>;
}

export class RecordPhraseReviewUseCase {
  constructor(
    private readonly phraseReviewRepository: PhraseReviewRepository,
    private readonly spacedRepetitionService: SpacedRepetitionService,
    private readonly userRepository: UserRepository,
    private readonly checkAchievementsUseCase: CheckAchievementsUseCase
  ) {}

  async execute(
    input: RecordPhraseReviewInput
  ): Promise<RecordPhraseReviewOutput> {
    const now = new Date();
    const dailyCap = input.dailyReviewCap ?? 300;
    const reviewsToday = await this.phraseReviewRepository.countReviewsOnDate(
      input.userId,
      now
    );
    if (reviewsToday >= dailyCap) {
      throw new Error("Daily review limit reached");
    }

    const existing = await this.phraseReviewRepository.findByUserAndPhrase(
      input.userId,
      input.phraseId
    );

    let reviewState: PhraseReviewState;

    if (!existing) {
      const schedule = this.spacedRepetitionService.initialSchedule(
        input.rating,
        now
      );
      reviewState = await this.phraseReviewRepository.create(
        {
          userId: input.userId,
          phraseId: input.phraseId,
          easeFactor: schedule.easeFactor,
          interval: schedule.interval,
          repetitions: schedule.repetitions,
          due: schedule.due,
          lastReviewedAt: now,
        },
        input.rating
      );
    } else {
      const schedule = this.spacedRepetitionService.scheduleNext(
        existing,
        input.rating,
        now
      );

      reviewState = await this.phraseReviewRepository.update(
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
