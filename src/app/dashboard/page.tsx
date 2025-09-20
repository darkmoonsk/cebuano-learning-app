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

        <div className="flex gap-12">
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
        </div>
      </div>
    </div>
  );
}
