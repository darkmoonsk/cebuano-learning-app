import { prisma } from "@/infrastructure/prisma/client";
import { Flashcard, FlashcardId } from "@/domain/entities/flashcard";
import { FlashcardRepository } from "@/domain/repositories/flashcard-repository";

export class PrismaFlashcardRepository implements FlashcardRepository {
  async findById(id: FlashcardId) {
    const record = await prisma.flashcard.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async listAllActive() {
    const records = await prisma.flashcard.findMany({ where: { isActive: true } });
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
        level: "asc",
      },
    });

    return records.map((record) => this.toDomain(record));
  }

  private toDomain(record: {
    id: string;
    english: string;
    cebuano: string;
    partOfSpeech: string;
    level: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Flashcard({
      id: record.id,
      english: record.english,
      cebuano: record.cebuano,
      partOfSpeech: record.partOfSpeech,
      level: record.level,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
