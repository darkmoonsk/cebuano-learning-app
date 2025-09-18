import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "./client";

interface CebuanoWordRecord {
  id: number;
  english: string;
  cebuano: string;
  pos: string;
  level: string;
}

async function main() {
  const dataPath = path.resolve(process.cwd(), "src/app/data/cebuano_words.json");
  const content = await readFile(dataPath, "utf-8");
  const words = JSON.parse(content) as CebuanoWordRecord[];

  for (const word of words) {
    await prisma.flashcard.upsert({
      where: { id: String(word.id) },
      update: {
        english: word.english,
        cebuano: word.cebuano,
        partOfSpeech: word.pos,
        level: word.level,
        isActive: true,
      },
      create: {
        id: String(word.id),
        english: word.english,
        cebuano: word.cebuano,
        partOfSpeech: word.pos,
        level: word.level,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
