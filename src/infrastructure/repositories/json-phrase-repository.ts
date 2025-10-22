import { Phrase } from "@/domain/entities/phrase";
import { PhraseRepository } from "@/domain/repositories/phrase-repository";
import phrases from "@/app/data/cebuano_phrases.json";

type JsonPhrase = {
  cebuano: string;
  english: string;
};

export class JsonPhraseRepository implements PhraseRepository {
  private phrases: Phrase[] | null = null;

  private getPhrases(): Phrase[] {
    if (this.phrases === null) {
      this.phrases = (phrases as JsonPhrase[]).map(
        (p, index) =>
          new Phrase({
            id: String(index + 1),
            cebuano: p.cebuano,
            english: p.english,
            isActive: true,
            createdAt: new Date(0),
            updatedAt: new Date(0),
          })
      );
    }
    return this.phrases;
  }

  async findById(id: string): Promise<Phrase | null> {
    const phrases = this.getPhrases();
    const found = phrases.find((p) => p.id === id) ?? null;
    return found;
  }

  async listAllActive(): Promise<Phrase[]> {
    return this.getPhrases();
  }

  async findDueForUser(userId: string, limit: number): Promise<Phrase[]> {
    // Return first N phrases for new users
    // The actual filtering of already-learned phrases happens in the use case
    return this.getPhrases().slice(0, limit);
  }
}
