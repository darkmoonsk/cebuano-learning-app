import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { useCases } from "@/infrastructure/container";
import { PhraseLearningPanel } from "@/presentation/components/phrase-learning-panel";

export default async function PhrasesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let phrases: Array<{
    id: string;
    cebuano: string;
    english: string;
  }> = [];
  let progress: { totalLearned: number; dueToday: number; streak: number } = {
    totalLearned: 0,
    dueToday: 0,
    streak: 0,
  };

  try {
    const [phrasesResult, progressResult] = await Promise.all([
      useCases.getDuePhrases().execute({
        userId: session.user.id,
        limit: 4,
        newDailyCap: 4,
      }),
      useCases.getPhraseProgress().execute({ userId: session.user.id }),
    ]);
    phrases = phrasesResult.due.map((phrase) => ({
      id: phrase.id,
      cebuano: phrase.cebuano,
      english: phrase.english,
    }));
    progress = progressResult;
  } catch (error) {
    console.error("Error loading phrases:", error);
    // Fallback: JSON-only mode if database is unavailable
    const phrasesData = await import("@/app/data/cebuano_phrases.json");
    const phrasesArray = phrasesData.default || phrasesData;
    phrases = phrasesArray
      .slice(0, 4)
      .map((phrase: { cebuano: string; english: string }, index: number) => ({
        id: String(index + 1),
        cebuano: phrase.cebuano,
        english: phrase.english,
      }));
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Phrase Builder
        </h1>
        <p className="text-muted-foreground">
          Learn Cebuano phrases by assembling word blocks in the correct order.
        </p>
      </div>
      <PhraseLearningPanel
        userId={session.user.id}
        initialPhrases={phrases}
        initialProgress={progress}
      />
    </div>
  );
}
