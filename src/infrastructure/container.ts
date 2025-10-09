// Infrastructure repositories
import { PrismaUserRepository } from "@/infrastructure/repositories/prisma-user-repository";
import { PrismaFlashcardRepository } from "@/infrastructure/repositories/prisma-flashcard-repository";
import { PrismaReviewRepository } from "@/infrastructure/repositories/prisma-review-repository";
import { PrismaPasswordResetTokenRepository } from "@/infrastructure/repositories/prisma-password-reset-token-repository";

// Application use cases
import { RegisterUserUseCase } from "@/application/use-cases/register-user";
import { AuthenticateUserUseCase } from "@/application/use-cases/authenticate-user";
import { GetDueFlashcardsUseCase } from "@/application/use-cases/get-due-flashcards";
import { RecordReviewUseCase } from "@/application/use-cases/record-review";
import { GetProgressUseCase } from "@/application/use-cases/get-progress";
import { GetWordExplainWithAIUseCase } from "@/application/use-cases/get-word-explain";
import { RequestPasswordResetUseCase } from "@/application/use-cases/request-password-reset";
import { ResetPasswordUseCase } from "@/application/use-cases/reset-password";

// Application services
import { AIService } from "@/domain/services/ai";
import { BcryptPasswordHasher } from "@/infrastructure/auth/bcrypt-password-hasher";

// Domain services
import { SpacedRepetitionService } from "@/domain/services/spaced-repetition";
import { ProgressService } from "@/domain/services/progress";
import { ResendEmailService } from "@/infrastructure/email/resend-email-service";

const userRepository = new PrismaUserRepository();
const flashcardRepository = new PrismaFlashcardRepository();
const reviewRepository = new PrismaReviewRepository();
const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository();
const passwordHasher = new BcryptPasswordHasher();
const spacedRepetitionService = new SpacedRepetitionService();
const progressService = new ProgressService();
const aiService = new AIService();
const emailService = new ResendEmailService(
  process.env.RESEND_API_KEY,
  process.env.EMAIL_FROM,
  process.env.NEXT_PUBLIC_APP_URL
);

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
  requestPasswordReset: () =>
    new RequestPasswordResetUseCase({
      userRepository,
      tokenRepository: passwordResetTokenRepository,
    }),
  resetPassword: () =>
    new ResetPasswordUseCase(
      userRepository,
      passwordResetTokenRepository,
      passwordHasher
    ),
};

export const services = {
  email: emailService,
};
