export interface PhraseReviewPersistenceInput {
  userId: string;
  phraseId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  due: Date;
  lastReviewedAt: Date | null;
}

export interface PhraseReviewProgressSnapshot {
  reviewsCompleted: number;
  consecutiveDays: number;
  dueCount: number;
}

export interface PhraseReviewRepository {
  findByUserAndPhrase(
    userId: string,
    phraseId: string
  ): Promise<PhraseReviewState | null>;
  create(
    data: PhraseReviewPersistenceInput,
    rating: string
  ): Promise<PhraseReviewState>;
  update(
    id: string,
    data: Partial<PhraseReviewPersistenceInput>,
    rating: string
  ): Promise<PhraseReviewState>;
  countReviewsOnDate(userId: string, date: Date): Promise<number>;
  getProgressSnapshot(
    userId: string,
    now: Date
  ): Promise<PhraseReviewProgressSnapshot>;
  listIntroducedPhraseIds(userId: string): Promise<string[]>;
  findDueByUser(
    userId: string,
    limit: number,
    now: Date
  ): Promise<PhraseReviewState[]>;
  countIntroductionsOnDate(userId: string, date: Date): Promise<number>;
}

export interface PhraseReviewState {
  id: string;
  userId: string;
  phraseId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  due: Date;
  lastReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
