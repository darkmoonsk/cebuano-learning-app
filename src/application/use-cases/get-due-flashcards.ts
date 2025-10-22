import { Flashcard } from "@/domain/entities/flashcard";
import { FlashcardRepository } from "@/domain/repositories/flashcard-repository";
import { ReviewRepository } from "@/domain/repositories/review-repository";

export interface GetDueFlashcardsInput {
  userId: string;
  /** Max cards to review this session */
  limit?: number;
  /** Max number of new cards introduced per day */
  newDailyCap?: number;
  /** Only introduce new cards with rank strictly greater than this */
  startAfterRank?: number;
}

export interface GetDueFlashcardsResult {
  due: Flashcard[];
}

export class GetDueFlashcardsUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly flashcardRepository: FlashcardRepository
  ) {}

  async execute(input: GetDueFlashcardsInput): Promise<GetDueFlashcardsResult> {
    const limit = input.limit ?? 30;
    const startAfterRank = input.startAfterRank ?? 0;
    const now = new Date();
    const reviewStates = await this.reviewRepository.findDueByUser(
      input.userId,
      now,
      limit
    );

    const flashcards: Flashcard[] = [];

    for (const state of reviewStates) {
      const card = await this.flashcardRepository.findById(state.flashcardId);
      if (card) {
        flashcards.push(card);
      }
    }

    if (flashcards.length < limit) {
      const introducedToday =
        await this.reviewRepository.countIntroductionsOnDate(input.userId, now);
      const newDailyCap = input.newDailyCap ?? 30;
      const remainingNewToday = Math.max(0, newDailyCap - introducedToday);
      const allowedTopUp = Math.min(
        remainingNewToday,
        limit - flashcards.length
      );
      if (allowedTopUp > 0) {
        // Select first unseen cards by order, without N+1 queries
        const allActive = await this.flashcardRepository.listAllActive();
        const introducedIds = new Set(
          await this.reviewRepository.listIntroducedFlashcardIds(input.userId)
        );
        const existingIds = new Set(flashcards.map((c) => c.id));
        for (const card of allActive) {
          if (existingIds.has(card.id)) continue;
          if (introducedIds.has(card.id)) continue;
          const numericRank = Number(card.id);
          if (Number.isFinite(numericRank) && numericRank <= startAfterRank)
            continue;
          flashcards.push(card);
          if (flashcards.length >= limit) break;
          if (flashcards.length >= allowedTopUp + reviewStates.length) break;
        }
      }
    }

    return { due: flashcards };
  }
}
