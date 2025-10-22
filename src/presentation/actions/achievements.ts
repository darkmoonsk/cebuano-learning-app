"use server";

import { auth } from "@/auth";
import { useCases } from "@/infrastructure/container";

export async function fetchUserAchievements() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    return await useCases
      .getUserAchievements()
      .execute({ userId: session.user.id });
  } catch (error) {
    console.error("Failed to fetch user achievements:", error);
    return [];
  }
}

export async function checkAndGetNewAchievements() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    return await useCases
      .checkAchievements()
      .execute({ userId: session.user.id });
  } catch (error) {
    console.error("Failed to check achievements:", error);
    return [];
  }
}

export async function markAchievementsAsNotified(achievementIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    // This would need to be implemented in the achievement repository
    // For now, we'll just return success
    return { success: true };
  } catch (error) {
    console.error("Failed to mark achievements as notified:", error);
    return { success: false };
  }
}
