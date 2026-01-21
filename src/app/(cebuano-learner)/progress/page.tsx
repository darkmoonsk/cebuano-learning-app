import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { useCases } from "@/infrastructure/container";
import { ProgressStats } from "@/presentation/components/progress-stats";
import { fetchUserAchievements } from "@/presentation/actions/achievements";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let progress: { totalLearned: number; dueToday: number; streak: number } = {
    totalLearned: 0,
    dueToday: 0,
    streak: 0,
  };

  let achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    isUnlocked: boolean;
    unlockedAt?: Date;
    notifiedAt?: Date | null;
    progress?: {
      current: number;
      target: number;
      percentage: number;
    };
  }> = [];

  try {
    [progress, achievements] = await Promise.all([
      useCases.getProgress().execute({ userId: session.user.id }),
      fetchUserAchievements(),
    ]);
  } catch {
    // Fallback values if database is unavailable
    progress = { totalLearned: 0, dueToday: 0, streak: 0 };
    achievements = [];
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Your Learning Progress
        </h1>
        <p className="text-muted-foreground">
          Track your Cebuano vocabulary learning journey and see how much
          you&apos;ve accomplished.
        </p>
      </div>

      <ProgressStats
        totalLearned={progress.totalLearned}
        dueToday={progress.dueToday}
        streak={progress.streak}
        userName={session.user.name || session.user.email || "User"}
        achievements={achievements}
      />
    </div>
  );
}
