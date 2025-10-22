import { Phrase } from "@/domain/entities/phrase";
import { PhraseRepository } from "@/domain/repositories/phrase-repository";
import { PhraseReviewRepository } from "@/domain/repositories/phrase-review-repository";

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
    private readonly phraseRepository: PhraseRepository
  ) {}

  async execute(input: GetDuePhrasesInput): Promise<GetDuePhrasesResult> {
    const { userId, limit, newDailyCap = 4, startAfterId } = input;

    // Get all phrases and learned phrase IDs in parallel
    const [allPhrases, learnedPhraseIds] = await Promise.all([
      this.phraseRepository.listAllActive(),
      this.phraseReviewRepository.listIntroducedPhraseIds(userId),
    ]);

    const learnedPhraseIdsSet = new Set(learnedPhraseIds);

    // Get unlearned phrases
    const unlearnedPhrases = allPhrases.filter(
      (phrase) => !learnedPhraseIdsSet.has(phrase.id)
    );

    // If we have a startAfterId, filter phrases after that ID
    let phrasesToReturn = unlearnedPhrases;
    if (startAfterId) {
      const startIndex = unlearnedPhrases.findIndex(
        (phrase) => phrase.id === startAfterId
      );
      if (startIndex !== -1) {
        phrasesToReturn = unlearnedPhrases.slice(startIndex + 1);
      }
    }

    // Limit to newDailyCap for new phrases
    const newPhrases = phrasesToReturn.slice(0, newDailyCap);

    // Get due phrases for review (learned phrases that are due)
    const now = new Date();
    const dueReviews = await this.phraseReviewRepository.findDueByUser(
      userId,
      limit,
      now
    );

    // Get phrases for due reviews
    const duePhrases = await Promise.all(
      dueReviews.map((review) =>
        this.phraseRepository.findById(review.phraseId)
      )
    );
    const validDuePhrases = duePhrases.filter(
      (phrase): phrase is Phrase => phrase !== null
    );

    // Mix new phrases with due phrases, prioritizing due phrases
    const totalLimit = Math.min(limit, newDailyCap + validDuePhrases.length);
    const mixedPhrases = [...validDuePhrases, ...newPhrases].slice(
      0,
      totalLimit
    );

    return {
      due: mixedPhrases,
    };
  }
}
