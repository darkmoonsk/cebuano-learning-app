import { Phrase } from "@/domain/entities/phrase";

export interface PhraseRepository {
  findById(id: string): Promise<Phrase | null>;
  listAllActive(): Promise<Phrase[]>;
  findDueForUser(userId: string, limit: number): Promise<Phrase[]>;
}
