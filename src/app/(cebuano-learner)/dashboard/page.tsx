import { redirect } from "next/navigation";
import { auth } from "@/auth";
import FeatureOptionCard from "@/presentation/components/feature-option-card";
import Image from "next/image";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="space-y-8 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome back{session.user.name ? `, ${session.user.name}` : ""}
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureOptionCard
            title="Flashcards"
            description="Review your Cebuano flashcards with adaptive spaced repetition."
            href="/dashboard/flashcards"
            content={
              <Image
                src="/flashcards.png"
                alt="Flashcards"
                width={280}
                height={280}
                className="rounded-xl"
                priority
                unoptimized
              />
            }
          />

          <FeatureOptionCard
            title="Listening game"
            description="Listen to the word and choose the correct option."
            href="/dashboard/listening"
            content={
              <Image
                src="/listen.png"
                alt="Listening game"
                width={280}
                height={280}
                className="rounded-xl"
                priority
                unoptimized
              />
            }
          />

          <FeatureOptionCard
            title="Phrase Builder"
            description="Learn Cebuano phrases by building them with word blocks."
            href="/dashboard/phrases"
            content={
              <Image
                src="/phrases.png"
                alt="Phrase Builder"
                width={280}
                height={280}
                className="rounded-xl"
                priority
                unoptimized
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
