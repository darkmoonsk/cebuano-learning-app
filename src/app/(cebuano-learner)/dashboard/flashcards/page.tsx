import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { useCases } from "@/infrastructure/container";
import { FlashcardReviewPanel } from "@/presentation/components/flashcard-review-panel";
import type { FlashcardDto } from "@/presentation/actions/flashcards";
import words from "@/app/data/cebuano_words.json";

function mapToDto(flashcard: {
  id: string;
  english: string;
  cebuano: string;
}): FlashcardDto {
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
}

export default async function FlashcardsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let flashcards: FlashcardDto[] = [];
  let progress: { totalLearned: number; dueToday: number; streak: number } = {
    totalLearned: 0,
    dueToday: 0,
    streak: 0,
  };

  try {
    const settings = await useCases
      .getUserSettings()
      .execute({ userId: session.user.id });
    const [flashcardsResult, progressResult] = await Promise.all([
      useCases.getDueFlashcards().execute({
        userId: session.user.id,
        limit: settings.sessionLimit,
        newDailyCap: settings.newDailyCap,
        startAfterRank: settings.lastLearnedRank,
      }),
      useCases.getProgress().execute({ userId: session.user.id }),
    ]);
    flashcards = flashcardsResult.due.map(mapToDto);
    progress = progressResult;
  } catch {
    // Fallback: JSON-only mode if database is unavailable
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
      .slice(0, 30)
      .map((w) => ({
        rank: w.rank,
        english: w.english,
        cebuano: w.cebuano,
        explanation: w.explanation ?? "",
      }));
    flashcards = top;
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Review your Cebuano flashcards with adaptive spaced repetition.
        </p>
      </div>
      <FlashcardReviewPanel
        initialFlashcards={flashcards}
        initialProgress={progress}
      />
    </div>
  );
}
