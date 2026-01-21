import { randomUUID } from "crypto";
import { Phrase } from "@/domain/entities/phrase";
import { PhraseRepository } from "@/domain/repositories/phrase-repository";
import { PhraseReviewRepository } from "@/domain/repositories/phrase-review-repository";
import { AIService } from "@/domain/services/ai";

export interface GetDuePhrasesInput {
  userId: string;
  limit: number;
  newDailyCap?: number;
  startAfterId?: string;
}

export interface GetDuePhrasesResult {
  due: Phrase[];
}

export class GetDuePhrasesUseCase {
  constructor(
    private readonly phraseReviewRepository: PhraseReviewRepository,
    private readonly phraseRepository: PhraseRepository,
    private readonly aiService: AIService
  ) {}

  async execute(input: GetDuePhrasesInput): Promise<GetDuePhrasesResult> {
    const { limit } = input;
    const generatedPhrases = await this.aiService.generatePhrases({
      count: limit,
      minWordCount: 4,
    });
    const now: Date = new Date();
    const aiPhrases: Phrase[] = generatedPhrases.map((phrase) => {
      const id: string = randomUUID();
      return new Phrase({
        id,
        cebuano: phrase.cebuano,
        english: phrase.english,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    });
    return {
      due: aiPhrases,
    };
  }
}
