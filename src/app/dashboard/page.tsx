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
      <div className="space-y-8">
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
            description="Learn Cebuano phrases by assembling word blocks in the correct order."
            href="/dashboard/phrases"
            content={
              <div className="flex h-[280px] w-[280px] items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <div className="text-center">
                  <div className="text-4xl mb-2">🧩</div>
                  <div className="text-lg font-semibold">Phrase Builder</div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
