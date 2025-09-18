import { SpacedRepetitionService } from "@/domain/services/spaced-repetition";
import { Difficulty } from "@/domain/value-objects/difficulty-rating";
import { ReviewRepository } from "@/domain/repositories/review-repository";

export interface RecordReviewInput {
  userId: string;
  flashcardId: string;
  rating: Difficulty;
}

export class RecordReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly spacedRepetitionService: SpacedRepetitionService,
  ) {}

  async execute(input: RecordReviewInput) {
    const now = new Date();
    const existing = await this.reviewRepository.findByUserAndFlashcard(
      input.userId,
      input.flashcardId,
    );

    if (!existing) {
      const schedule = this.spacedRepetitionService.initialSchedule(input.rating, now);
      return this.reviewRepository.create(
        {
          userId: input.userId,
          flashcardId: input.flashcardId,
          easeFactor: schedule.easeFactor,
          interval: schedule.interval,
          repetitions: schedule.repetitions,
          due: schedule.due,
          lastReviewedAt: now,
        },
        input.rating,
      );
    }

    const schedule = this.spacedRepetitionService.scheduleNext(existing, input.rating, now);

    return this.reviewRepository.update(
      existing.id,
      {
        easeFactor: schedule.easeFactor,
        interval: schedule.interval,
        repetitions: schedule.repetitions,
        due: schedule.due,
        lastReviewedAt: now,
      },
      input.rating,
    );
  }
}
