import { prisma } from "@/infrastructure/prisma/client";
import {
  ReviewPersistenceInput,
  ReviewProgressSnapshot,
  ReviewRepository,
} from "@/domain/repositories/review-repository";
import { ReviewState } from "@/domain/entities/review";

export class PrismaReviewRepository implements ReviewRepository {
  async findByUserAndFlashcard(userId: string, flashcardId: string) {
    const record = await prisma.reviewState.findFirst({
      where: { userId, flashcardId },
    });

    return record ? this.toDomain(record) : null;
  }

  async listIntroducedFlashcardIds(userId: string): Promise<string[]> {
    const records = await prisma.reviewState.findMany({
      where: { userId },
      select: { flashcardId: true },
    });
    return records.map((r) => r.flashcardId);
  }

  async findDueByUser(userId: string, now: Date, limit: number) {
    const records = await prisma.reviewState.findMany({
      where: { userId, due: { lte: now } },
      orderBy: { due: "asc" },
      take: limit,
    });

    return records.map((record) => this.toDomain(record));
  }

  async create(data: ReviewPersistenceInput, rating: string) {
    const record = await prisma.reviewState.create({
      data,
    });

    await prisma.reviewEvent.create({
      data: {
        userId: data.userId,
        flashcardId: data.flashcardId,
        rating,
      },
    });

    return this.toDomain(record);
  }

  async update(
    id: string,
    data: Partial<ReviewPersistenceInput>,
    rating: string
  ) {
    const record = await prisma.reviewState.update({
      where: { id },
      data,
    });

    await prisma.reviewEvent.create({
      data: {
        userId: record.userId,
        flashcardId: record.flashcardId,
        rating,
      },
    });

    return this.toDomain(record);
  }

  async getProgressSnapshot(
    userId: string,
    now: Date
  ): Promise<ReviewProgressSnapshot> {
    const [totalEvents, dueCount] = await Promise.all([
      prisma.reviewEvent.count({ where: { userId } }),
      prisma.reviewState.count({ where: { userId, due: { lte: now } } }),
    ]);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await prisma.reviewEvent.findMany({
      where: {
        userId,
        createdAt: { gte: thirtyDaysAgo, lte: now },
      },
      orderBy: { createdAt: "desc" },
    });

    const consecutiveDays = this.computeStreak(events, now);

    return {
      reviewsCompleted: totalEvents,
      consecutiveDays,
      dueCount,
    };
  }

  async countReviewsOnDate(userId: string, date: Date): Promise<number> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    return prisma.reviewEvent.count({
      where: {
        userId,
        createdAt: { gte: dayStart, lt: dayEnd },
      },
    });
  }

  async countIntroductionsOnDate(userId: string, date: Date): Promise<number> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // We consider an "introduction" to be any ReviewState created this day for this user
    // with repetitions equal to 0 at creation time (first-time learn). Since we don't store
    // the repetition snapshot at creation separately, we approximate by counting creations.
    // That matches our flow where a ReviewState is only created on first review.
    return prisma.reviewState.count({
      where: {
        userId,
        createdAt: { gte: dayStart, lt: dayEnd },
      },
    });
  }

  async getAchievementStats(userId: string): Promise<{
    totalWordsLearned: number;
    totalReviews: number;
    currentStreak: number;
    perfectReviewStreak: number;
    reviewTimes: Date[];
    lastReviewDate: Date | null;
  }> {
    const [totalWordsLearned, reviewEvents, reviewStates] = await Promise.all([
      prisma.reviewState.count({ where: { userId } }),
      prisma.reviewEvent.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true, rating: true },
      }),
      prisma.reviewState.findMany({
        where: { userId },
        orderBy: { lastReviewedAt: "desc" },
        select: { lastReviewedAt: true },
      }),
    ]);

    const totalReviews = reviewEvents.length;
    const reviewTimes = reviewEvents.map((event) => event.createdAt);
    const lastReviewDate = reviewTimes.length > 0 ? reviewTimes[0] : null;

    // Calculate current streak
    const currentStreak = this.computeStreak(
      reviewEvents.map((event) => ({
        createdAt: event.createdAt,
      })),
      new Date()
    );

    // Calculate perfect review streak
    const perfectReviewStreak = this.computePerfectReviewStreak(reviewEvents);

    return {
      totalWordsLearned,
      totalReviews,
      currentStreak,
      perfectReviewStreak,
      reviewTimes,
      lastReviewDate,
    };
  }

  private computePerfectReviewStreak(
    reviewEvents: { createdAt: Date; rating: string }[]
  ): number {
    let streak = 0;
    let currentStreak = 0;

    for (const event of reviewEvents) {
      if (event.rating === "perfect") {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return streak;
  }

  private computeStreak(events: { createdAt: Date }[], now: Date) {
    if (!events.length) {
      return 0;
    }

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    const currentDay = new Date(today);

    while (true) {
      const dayStart = new Date(currentDay);
      const dayEnd = new Date(currentDay);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const found = events.some(
        (event) => event.createdAt >= dayStart && event.createdAt < dayEnd
      );
      if (!found) {
        if (streak === 0 && currentDay.getTime() === today.getTime()) {
          break;
        }
        break;
      }

      streak += 1;
      currentDay.setDate(currentDay.getDate() - 1);
    }

    return streak;
  }

  private toDomain(record: {
    id: string;
    userId: string;
    flashcardId: string;
    easeFactor: number;
    interval: number;
    repetitions: number;
    due: Date;
    lastReviewedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new ReviewState({
      id: record.id,
      userId: record.userId,
      flashcardId: record.flashcardId,
      easeFactor: record.easeFactor,
      interval: record.interval,
      repetitions: record.repetitions,
      due: record.due,
      lastReviewedAt: record.lastReviewedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
