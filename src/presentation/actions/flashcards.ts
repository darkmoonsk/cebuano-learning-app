"use server";

import { Flashcard } from "@/domain/entities/flashcard";
import { Difficulty } from "@/domain/value-objects/difficulty-rating";
import { auth } from "@/auth";
import { useCases } from "@/infrastructure/container";
import { revalidatePath } from "next/cache";

export interface FlashcardDto {
  id: string;
  english: string;
  cebuano: string;
  partOfSpeech: string;
  level: string;
}

const toDto = (flashcard: Flashcard): FlashcardDto => ({
  id: flashcard.id,
  english: flashcard.english,
  cebuano: flashcard.cebuano,
  partOfSpeech: flashcard.partOfSpeech,
  level: flashcard.level,
});

export async function fetchDueFlashcards(limit?: number): Promise<FlashcardDto[]> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await useCases
    .getDueFlashcards()
    .execute({ userId: session.user.id, limit });

  return result.due.map(toDto);
}

export async function submitReview({ flashcardId, rating }: { flashcardId: string; rating: Difficulty }) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await useCases.recordReview().execute({
    userId: session.user.id,
    flashcardId,
    rating,
  });

  revalidatePath("/dashboard");
}

export async function fetchProgress() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return useCases.getProgress().execute({ userId: session.user.id });
}

