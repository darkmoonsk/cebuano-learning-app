// Infrastructure repositories
import { PrismaUserRepository } from "@/infrastructure/repositories/prisma-user-repository";
import { PrismaFlashcardRepository } from "@/infrastructure/repositories/prisma-flashcard-repository";
import { PrismaReviewRepository } from "@/infrastructure/repositories/prisma-review-repository";

// Application use cases
import { RegisterUserUseCase } from "@/application/use-cases/register-user";
import { AuthenticateUserUseCase } from "@/application/use-cases/authenticate-user";
import { GetDueFlashcardsUseCase } from "@/application/use-cases/get-due-flashcards";
import { RecordReviewUseCase } from "@/application/use-cases/record-review";
import { GetProgressUseCase } from "@/application/use-cases/get-progress";
import { GetWordExplainWithAIUseCase } from "@/application/use-cases/get-word-explain";

// Application services
import { AIService } from "@/domain/services/ai";
import { BcryptPasswordHasher } from "@/infrastructure/auth/bcrypt-password-hasher";

// Domain services
import { SpacedRepetitionService } from "@/domain/services/spaced-repetition";
import { ProgressService } from "@/domain/services/progress";

const userRepository = new PrismaUserRepository();
const flashcardRepository = new PrismaFlashcardRepository();
const reviewRepository = new PrismaReviewRepository();
const passwordHasher = new BcryptPasswordHasher();
const spacedRepetitionService = new SpacedRepetitionService();
const progressService = new ProgressService();
const aiService = new AIService();

export const useCases = {
  registerUser: () => new RegisterUserUseCase(userRepository, passwordHasher),
  authenticateUser: () =>
    new AuthenticateUserUseCase(userRepository, passwordHasher),
  getDueFlashcards: () =>
    new GetDueFlashcardsUseCase(reviewRepository, flashcardRepository),
  recordReview: () =>
    new RecordReviewUseCase(reviewRepository, spacedRepetitionService),
  getProgress: () => new GetProgressUseCase(reviewRepository, progressService),
  getWordExplainWithAI: () => new GetWordExplainWithAIUseCase(aiService),
};
