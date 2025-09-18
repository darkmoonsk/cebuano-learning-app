import { Flashcard } from "@/domain/entities/flashcard";
import { FlashcardRepository } from "@/domain/repositories/flashcard-repository";
import { ReviewRepository } from "@/domain/repositories/review-repository";

export interface GetDueFlashcardsInput {
  userId: string;
  limit?: number;
}

export interface GetDueFlashcardsResult {
  due: Flashcard[];
}

export class GetDueFlashcardsUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly flashcardRepository: FlashcardRepository,
  ) {}

  async execute(input: GetDueFlashcardsInput): Promise<GetDueFlashcardsResult> {
    const limit = input.limit ?? 10;
    const now = new Date();
    const reviewStates = await this.reviewRepository.findDueByUser(
      input.userId,
      now,
      limit,
    );

    const flashcards: Flashcard[] = [];

    for (const state of reviewStates) {
      const card = await this.flashcardRepository.findById(state.flashcardId);
      if (card) {
        flashcards.push(card);
      }
    }

    if (flashcards.length < limit) {
      const additional = await this.flashcardRepository.findDueForUser(
        input.userId,
        limit - flashcards.length,
      );
      flashcards.push(...additional);
    }

    return { due: flashcards };
  }
}
