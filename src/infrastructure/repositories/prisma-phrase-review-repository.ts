import { prisma } from "@/infrastructure/prisma/client";
import {
  PhraseReviewRepository,
  PhraseReviewPersistenceInput,
  PhraseReviewProgressSnapshot,
  PhraseReviewState,
} from "@/domain/repositories/phrase-review-repository";

export class PrismaPhraseReviewRepository implements PhraseReviewRepository {
  async findByUserAndPhrase(userId: string, phraseId: string) {
    const record = await prisma.phraseReviewState.findFirst({
      where: { userId, phraseId },
    });
    return record ? this.toDomain(record) : null;
  }

  async create(data: PhraseReviewPersistenceInput, rating: string) {
    const record = await prisma.phraseReviewState.create({
      data: {
        userId: data.userId,
        phraseId: data.phraseId,
        easeFactor: data.easeFactor,
        interval: data.interval,
        repetitions: data.repetitions,
        due: data.due,
        lastReviewedAt: data.lastReviewedAt,
      },
    });

    await prisma.phraseReviewEvent.create({
      data: {
        userId: data.userId,
        phraseId: data.phraseId,
        rating,
      },
    });

    return this.toDomain(record);
  }

  async update(
    id: string,
    data: Partial<PhraseReviewPersistenceInput>,
    rating: string
  ) {
    const record = await prisma.phraseReviewState.update({
      where: { id },
      data: {
        easeFactor: data.easeFactor,
        interval: data.interval,
        repetitions: data.repetitions,
        due: data.due,
        lastReviewedAt: data.lastReviewedAt,
      },
    });

    await prisma.phraseReviewEvent.create({
      data: {
        userId: record.userId,
        phraseId: record.phraseId,
        rating,
      },
    });

    return this.toDomain(record);
  }

  async getProgressSnapshot(
    userId: string,
    now: Date
  ): Promise<PhraseReviewProgressSnapshot> {
    const [totalEvents, dueCount] = await Promise.all([
      prisma.phraseReviewEvent.count({ where: { userId } }),
      prisma.phraseReviewState.count({ where: { userId, due: { lte: now } } }),
    ]);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const events = await prisma.phraseReviewEvent.findMany({
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
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return prisma.phraseReviewEvent.count({
      where: {
        userId,
        createdAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });
  }

  async listIntroducedPhraseIds(userId: string): Promise<string[]> {
    const reviewStates = await prisma.phraseReviewState.findMany({
      where: { userId },
      select: { phraseId: true },
    });
    return reviewStates.map((rs) => rs.phraseId);
  }

  async findDueByUser(
    userId: string,
    limit: number,
    now: Date
  ): Promise<PhraseReviewState[]> {
    const records = await prisma.phraseReviewState.findMany({
      where: {
        userId,
        due: { lte: now },
      },
      take: limit,
      orderBy: {
        due: "asc",
      },
    });
    return records.map((record) => this.toDomain(record));
  }

  async countIntroductionsOnDate(userId: string, date: Date): Promise<number> {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return prisma.phraseReviewEvent.count({
      where: {
        userId,
        createdAt: {
          gte: dayStart,
          lte: dayEnd,
        },
        rating: "again", // Assuming "again" is the rating for initial introduction
      },
    });
  }

  private computeStreak(events: Array<{ createdAt: Date }>, now: Date): number {
    if (events.length === 0) return 0;

    let streak = 0;
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < events.length; i++) {
      const eventDate = new Date(events[i].createdAt);
      eventDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - streak);

      if (eventDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else if (eventDate.getTime() < expectedDate.getTime()) {
        break;
      }
    }

    return streak;
  }

  private toDomain(record: {
    id: string;
    userId: string;
    phraseId: string;
    easeFactor: number;
    interval: number;
    repetitions: number;
    due: Date;
    lastReviewedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): PhraseReviewState {
    return {
      id: record.id,
      userId: record.userId,
      phraseId: record.phraseId,
      easeFactor: record.easeFactor,
      interval: record.interval,
      repetitions: record.repetitions,
      due: record.due,
      lastReviewedAt: record.lastReviewedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
