import { prisma } from "@/infrastructure/prisma/client";
import { Flashcard, FlashcardId } from "@/domain/entities/flashcard";
import { FlashcardRepository } from "@/domain/repositories/flashcard-repository";

export class PrismaFlashcardRepository implements FlashcardRepository {
  async findById(id: FlashcardId) {
    const record = await prisma.flashcard.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async listAllActive() {
    const records = await prisma.flashcard.findMany({
      where: { isActive: true },
    });
    return records.map((record) => this.toDomain(record));
  }

  async findDueForUser(userId: string, limit: number) {
    const records = await prisma.flashcard.findMany({
      where: {
        isActive: true,
        reviewStates: {
          none: {
            userId,
          },
        },
      },
      take: limit,
      orderBy: {
        rank: "asc",
      },
    });

    return records.map((record) => this.toDomain(record));
  }

  private toDomain(record: {
    id: string;
    rank: number;
    english: string;
    cebuano: string;
    explanation: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Flashcard({
      id: record.id,
      rank: record.rank,
      english: record.english,
      cebuano: record.cebuano,
      explanation: record.explanation,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
