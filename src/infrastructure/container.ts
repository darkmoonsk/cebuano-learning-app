// Infrastructure repositories
import { PrismaUserRepository } from "@/infrastructure/repositories/prisma-user-repository";
// import { PrismaFlashcardRepository } from "@/infrastructure/repositories/prisma-flashcard-repository";
import { JsonFlashcardRepository } from "@/infrastructure/repositories/json-flashcard-repository";
import { PrismaReviewRepository } from "@/infrastructure/repositories/prisma-review-repository";
import { PrismaPasswordResetTokenRepository } from "@/infrastructure/repositories/prisma-password-reset-token-repository";
import { PrismaAchievementRepository } from "@/infrastructure/repositories/prisma-achievement-repository";
import { JsonPhraseRepository } from "@/infrastructure/repositories/json-phrase-repository";
// import { PrismaPhraseRepository } from "@/infrastructure/repositories/prisma-phrase-repository";
import { PrismaPhraseReviewRepository } from "@/infrastructure/repositories/prisma-phrase-review-repository";

// Application use cases
import { RegisterUserUseCase } from "@/application/use-cases/register-user";
import { AuthenticateUserUseCase } from "@/application/use-cases/authenticate-user";
import { GetDueFlashcardsUseCase } from "@/application/use-cases/get-due-flashcards";
import { RecordReviewUseCase } from "@/application/use-cases/record-review";
import { GetProgressUseCase } from "@/application/use-cases/get-progress";
import { GetWordExplainWithAIUseCase } from "@/application/use-cases/get-word-explain";
import { RequestPasswordResetUseCase } from "@/application/use-cases/request-password-reset";
import { ResetPasswordUseCase } from "@/application/use-cases/reset-password";
import { GetUserSettingsUseCase } from "@/application/use-cases/get-user-settings";
import { UpdateUserSettingsUseCase } from "@/application/use-cases/update-user-settings";
import { GetUserAchievementsUseCase } from "@/application/use-cases/get-user-achievements";
import { CheckAchievementsUseCase } from "@/application/use-cases/check-achievements";
import { GetDuePhrasesUseCase } from "@/application/use-cases/get-due-phrases";
import { RecordPhraseReviewUseCase } from "@/application/use-cases/record-phrase-review";
import { GetPhraseProgressUseCase } from "@/application/use-cases/get-phrase-progress";

// Application services
import { AIService } from "@/domain/services/ai";
import { BcryptPasswordHasher } from "@/infrastructure/auth/bcrypt-password-hasher";

// Domain services
import { SpacedRepetitionService } from "@/domain/services/spaced-repetition";
import { ProgressService } from "@/domain/services/progress";
import { AchievementService } from "@/domain/services/achievement-service";
import { ResendEmailService } from "@/infrastructure/email/resend-email-service";

const userRepository = new PrismaUserRepository();
// Switch to JSON-based flashcards (from local dataset)
const flashcardRepository = new JsonFlashcardRepository();
const reviewRepository = new PrismaReviewRepository();
const passwordResetTokenRepository = new PrismaPasswordResetTokenRepository();
const achievementRepository = new PrismaAchievementRepository();
// Phrase repositories
const phraseRepository = new JsonPhraseRepository();
const phraseReviewRepository = new PrismaPhraseReviewRepository();
const passwordHasher = new BcryptPasswordHasher();
const spacedRepetitionService = new SpacedRepetitionService();
const progressService = new ProgressService();
const achievementService = new AchievementService();
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
    new RecordReviewUseCase(
      reviewRepository,
      spacedRepetitionService,
      userRepository,
      new CheckAchievementsUseCase(
        achievementRepository,
        achievementService,
        reviewRepository
      )
    ),
  getProgress: () => new GetProgressUseCase(reviewRepository, progressService),
  getWordExplainWithAI: () => new GetWordExplainWithAIUseCase(aiService),
  getUserSettings: () => new GetUserSettingsUseCase(userRepository),
  updateUserSettings: () => new UpdateUserSettingsUseCase(userRepository),
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
  getUserAchievements: () =>
    new GetUserAchievementsUseCase(achievementRepository, achievementService),
  checkAchievements: () =>
    new CheckAchievementsUseCase(
      achievementRepository,
      achievementService,
      reviewRepository
    ),
  getDuePhrases: () =>
    new GetDuePhrasesUseCase(
      phraseReviewRepository,
      phraseRepository,
      aiService
    ),
  recordPhraseReview: () =>
    new RecordPhraseReviewUseCase(
      phraseReviewRepository,
      spacedRepetitionService,
      userRepository,
      new CheckAchievementsUseCase(
        achievementRepository,
        achievementService,
        reviewRepository
      )
    ),
  getPhraseProgress: () =>
    new GetPhraseProgressUseCase(phraseReviewRepository, progressService),
};

export const services = {
  email: emailService,
};
