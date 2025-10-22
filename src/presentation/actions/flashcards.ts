"use server";

import { Flashcard } from "@/domain/entities/flashcard";
import { Difficulty } from "@/domain/value-objects/difficulty-rating";
import { auth } from "@/auth";
import { useCases } from "@/infrastructure/container";
import { revalidatePath } from "next/cache";
import words from "@/app/data/cebuano_words.json";

export interface FlashcardDto {
  rank: number;
  english: string;
  cebuano: string;
  explanation: string;
}

const toDto = (flashcard: Flashcard): FlashcardDto => {
  const rankNum = Number(flashcard.id);
  const explanation =
    (
      words as {
        rank: number;
        cebuano: string;
        english: string;
        explanation?: string;
      }[]
    ).find((w) => w.rank === rankNum)?.explanation ?? "";
  return {
    rank: rankNum,
    english: flashcard.english,
    cebuano: flashcard.cebuano,
    explanation,
  };
};

export async function fetchDueFlashcards(
  limit?: number,
  newDailyCap?: number
): Promise<FlashcardDto[]> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    let effectiveLimit = limit;
    let effectiveNewDailyCap = newDailyCap;
    let startAfterRank: number | undefined = undefined;

    if (effectiveLimit == null || effectiveNewDailyCap == null) {
      const settings = await useCases
        .getUserSettings()
        .execute({ userId: session.user.id });
      if (effectiveLimit == null) effectiveLimit = settings.sessionLimit;
      if (effectiveNewDailyCap == null)
        effectiveNewDailyCap = settings.newDailyCap;
      startAfterRank = settings.lastLearnedRank;
    }

    const result = await useCases.getDueFlashcards().execute({
      userId: session.user.id,
      limit: effectiveLimit,
      newDailyCap: effectiveNewDailyCap,
      startAfterRank,
    });
    return result.due.map(toDto);
  } catch {
    const settings = await useCases
      .getUserSettings()
      .execute({ userId: session.user.id });
    const fallbackLimit = limit ?? settings.sessionLimit ?? 30;
    const top = (
      words as {
        rank: number;
        cebuano: string;
        english: string;
        explanation?: string;
      }[]
    )
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .slice(0, fallbackLimit)
      .map((w) => ({
        rank: w.rank,
        english: w.english,
        cebuano: w.cebuano,
        explanation: w.explanation ?? "",
      }));
    return top;
  }
}

export async function submitReview({
  flashcardId,
  rating,
  dailyReviewCap,
}: {
  flashcardId: string;
  rating: Difficulty;
  dailyReviewCap?: number;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  let effectiveDailyReviewCap = dailyReviewCap;
  if (effectiveDailyReviewCap == null) {
    const settings = await useCases
      .getUserSettings()
      .execute({ userId: session.user.id });
    effectiveDailyReviewCap = settings.dailyReviewCap;
  }

  const result = await useCases.recordReview().execute({
    userId: session.user.id,
    flashcardId,
    rating,
    dailyReviewCap: effectiveDailyReviewCap,
  });

  revalidatePath("/dashboard");

  return result;
}

export async function fetchProgress() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    return await useCases.getProgress().execute({ userId: session.user.id });
  } catch {
    return { totalLearned: 0, dueToday: 0, streak: 0 };
  }
}
