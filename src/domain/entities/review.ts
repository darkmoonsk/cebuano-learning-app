import { FlashcardId } from "./flashcard";
import { UserId } from "./user";

export type ReviewId = string;

export interface ReviewStateProps {
  id: ReviewId;
  userId: UserId;
  flashcardId: FlashcardId;
  easeFactor: number;
  interval: number;
  repetitions: number;
  due: Date;
  lastReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ReviewState {
  readonly id: ReviewId;
  readonly userId: UserId;
  readonly flashcardId: FlashcardId;
  readonly easeFactor: number;
  readonly interval: number;
  readonly repetitions: number;
  readonly due: Date;
  readonly lastReviewedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ReviewStateProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.flashcardId = props.flashcardId;
    this.easeFactor = props.easeFactor;
    this.interval = props.interval;
    this.repetitions = props.repetitions;
    this.due = props.due;
    this.lastReviewedAt = props.lastReviewedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
