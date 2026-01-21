"use server";

import { useCases } from "@/infrastructure/container";
import { Difficulty } from "@/domain/value-objects/difficulty-rating";

export interface PhraseDto {
  id: string;
  cebuano: string;
  english: string;
}

interface ReviewStateDto {
  id: string;
  userId: string;
  phraseId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  due: Date;
  lastReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface AchievementDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: Date;
}

const toReviewStateDto = (reviewState: ReviewStateDto): ReviewStateDto => ({
  id: reviewState.id,
  userId: reviewState.userId,
  phraseId: reviewState.phraseId,
  easeFactor: reviewState.easeFactor,
  interval: reviewState.interval,
  repetitions: reviewState.repetitions,
  due: reviewState.due,
  lastReviewedAt: reviewState.lastReviewedAt,
  createdAt: reviewState.createdAt,
  updatedAt: reviewState.updatedAt,
});

const toAchievementDto = (achievement: AchievementDto): AchievementDto => ({
  id: achievement.id,
  name: achievement.name,
  description: achievement.description,
  icon: achievement.icon,
  category: achievement.category,
  unlockedAt: achievement.unlockedAt,
});

export async function fetchDuePhrases(
  userId: string,
  limit?: number,
  newDailyCap?: number
): Promise<PhraseDto[]> {
  try {
    const result = await useCases.getDuePhrases().execute({
      userId,
      limit: limit ?? 4,
      newDailyCap: newDailyCap ?? 4,
    });

    return result.due.map((phrase) => ({
      id: phrase.id,
      cebuano: phrase.cebuano,
      english: phrase.english,
    }));
  } catch (error) {
    console.error("Error fetching due phrases:", error);
    return [];
  }
}

export async function fetchPhraseProgress(userId: string): Promise<{
  totalLearned: number;
  dueToday: number;
  streak: number;
}> {
  try {
    return await useCases.getPhraseProgress().execute({
      userId,
    });
  } catch (error) {
    console.error("Error fetching phrase progress:", error);
    return {
      totalLearned: 0,
      dueToday: 0,
      streak: 0,
    };
  }
}

export async function submitPhraseReview({
  userId,
  phraseId,
  rating,
  dailyReviewCap,
}: {
  userId: string;
  phraseId: string;
  rating: Difficulty;
  dailyReviewCap?: number;
}) {
  try {
    const result = await useCases.recordPhraseReview().execute({
      userId,
      phraseId,
      rating,
      dailyReviewCap,
    });

    return {
      success: true,
      reviewState: toReviewStateDto(result.reviewState),
      newlyUnlockedAchievements: result.newlyUnlockedAchievements.map(
        toAchievementDto
      ),
    };
  } catch (error) {
    console.error("Error submitting phrase review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
