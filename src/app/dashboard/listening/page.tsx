import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ListeningGame from "@/presentation/components/listening-game";
import words from "@/app/data/cebuano_words.json";
import { WordItem } from "@/types/word-item";

export default async function ListeningPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <ListeningGame words={words as WordItem[]} />
    </div>
  );
}
