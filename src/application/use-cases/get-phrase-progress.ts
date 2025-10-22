import { PhraseReviewRepository } from "@/domain/repositories/phrase-review-repository";
import { ProgressService, ProgressSnapshot } from "@/domain/services/progress";

export interface GetPhraseProgressInput {
  userId: string;
}

export class GetPhraseProgressUseCase {
  constructor(
    private readonly phraseReviewRepository: PhraseReviewRepository,
    private readonly progressService: ProgressService
  ) {}

  async execute(input: GetPhraseProgressInput): Promise<ProgressSnapshot> {
    const now = new Date();
    const snapshot = await this.phraseReviewRepository.getProgressSnapshot(
      input.userId,
      now
    );

    return this.progressService.compute(snapshot);
  }
}
