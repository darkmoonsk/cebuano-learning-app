export type FlashcardId = string;

export interface FlashcardProps {
  id: FlashcardId;
  english: string;
  cebuano: string;
  partOfSpeech: string;
  level: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Flashcard {
  readonly id: FlashcardId;
  readonly english: string;
  readonly cebuano: string;
  readonly partOfSpeech: string;
  readonly level: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: FlashcardProps) {
    this.id = props.id;
    this.english = props.english;
    this.cebuano = props.cebuano;
    this.partOfSpeech = props.partOfSpeech;
    this.level = props.level;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
