import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { useCases } from "@/infrastructure/container";
import { FlashcardReviewPanel } from "@/presentation/components/flashcard-review-panel";
import type { FlashcardDto } from "@/presentation/actions/flashcards";

function mapToDto(flashcard: {
  id: string;
  english: string;
  cebuano: string;
  partOfSpeech: string;
  level: string;
}): FlashcardDto {
  return {
    id: flashcard.id,
    english: flashcard.english,
    cebuano: flashcard.cebuano,
    partOfSpeech: flashcard.partOfSpeech,
    level: flashcard.level,
  };
}

export default async function FlashcardsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [flashcardsResult, progress] = await Promise.all([
    useCases.getDueFlashcards().execute({ userId: session.user.id, limit: 10 }),
    useCases.getProgress().execute({ userId: session.user.id }),
  ]);

  const flashcards = flashcardsResult.due.map(mapToDto);

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
