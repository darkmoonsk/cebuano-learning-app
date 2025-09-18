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
