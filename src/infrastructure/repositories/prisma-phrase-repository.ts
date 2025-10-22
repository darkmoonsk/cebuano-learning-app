import { prisma } from "@/infrastructure/prisma/client";
import { Phrase, PhraseId } from "@/domain/entities/phrase";
import { PhraseRepository } from "@/domain/repositories/phrase-repository";

export class PrismaPhraseRepository implements PhraseRepository {
  async findById(id: PhraseId) {
    const record = await prisma.phrase.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async listAllActive() {
    const records = await prisma.phrase.findMany({ where: { isActive: true } });
    return records.map((record) => this.toDomain(record));
  }

  async findDueForUser(userId: string, limit: number) {
    const records = await prisma.phrase.findMany({
      where: {
        isActive: true,
        reviewStates: {
          none: {
            userId,
          },
        },
      },
      take: limit,
    });

    return records.map((record) => this.toDomain(record));
  }

  private toDomain(record: {
    id: string;
    cebuano: string;
    english: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new Phrase({
      id: record.id,
      cebuano: record.cebuano,
      english: record.english,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
