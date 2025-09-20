import { ReviewState, ReviewId } from "../entities/review";

export interface ReviewPersistenceInput {
  userId: string;
  flashcardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  due: Date;
  lastReviewedAt: Date | null;
}

export interface ReviewProgressSnapshot {
  reviewsCompleted: number;
  consecutiveDays: number;
  dueCount: number;
}

export interface ReviewRepository {
  findByUserAndFlashcard(
    userId: string,
    flashcardId: string
  ): Promise<ReviewState | null>;
  findDueByUser(
    userId: string,
    now: Date,
    limit: number
  ): Promise<ReviewState[]>;
  create(data: ReviewPersistenceInput, rating: string): Promise<ReviewState>;
  update(
    id: ReviewId,
    data: Partial<ReviewPersistenceInput>,
    rating: string
  ): Promise<ReviewState>;
  getProgressSnapshot(
    userId: string,
    now: Date
  ): Promise<ReviewProgressSnapshot>;
  /**
   * Counts how many new flashcards were introduced (first review state created) on the given calendar day.
   */
  countIntroductionsOnDate(userId: string, date: Date): Promise<number>;
}
