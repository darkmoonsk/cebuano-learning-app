import words from "@/app/data/cebuano_words.json";
import { Flashcard } from "@/domain/entities/flashcard";
import { FlashcardRepository } from "@/domain/repositories/flashcard-repository";

type JsonWord = {
  rank: number;
  cebuano: string;
  english: string;
  explanation?: string;
};

export class JsonFlashcardRepository implements FlashcardRepository {
  private readonly cards: Flashcard[];

  constructor() {
    this.cards = (words as JsonWord[])
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map(
        (w) =>
          new Flashcard({
            id: String(w.rank),
            rank: w.rank,
            english: w.english,
            cebuano: w.cebuano,
            explanation: w.explanation || "",
            isActive: true,
            createdAt: new Date(0),
            updatedAt: new Date(0),
          })
      );
  }

  async findById(id: string) {
    const found = this.cards.find((c) => c.id === id) ?? null;
    return found;
  }

  async listAllActive() {
    return this.cards;
  }

  async findDueForUser(userId: string, limit: number) {
    // New cards selection: the first N active cards by rank (level) that the user has not seen.
    // Responsibility to exclude already-introduced cards stays in ReviewRepository in the use case flow.
    return this.cards.slice(0, limit);
  }
}
