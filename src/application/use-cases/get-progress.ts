import { ProgressService } from "@/domain/services/progress";
import { ReviewRepository } from "@/domain/repositories/review-repository";

export interface GetProgressInput {
  userId: string;
}

export class GetProgressUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly progressService: ProgressService,
  ) {}

  async execute(input: GetProgressInput) {
    const now = new Date();
    const snapshot = await this.reviewRepository.getProgressSnapshot(
      input.userId,
      now,
    );

    return this.progressService.compute(snapshot);
  }
}
