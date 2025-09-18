import { Flashcard, FlashcardId } from "../entities/flashcard";

export interface FlashcardRepository {
  findById(id: FlashcardId): Promise<Flashcard | null>;
  findDueForUser(userId: string, limit: number): Promise<Flashcard[]>;
  listAllActive(): Promise<Flashcard[]>;
}
