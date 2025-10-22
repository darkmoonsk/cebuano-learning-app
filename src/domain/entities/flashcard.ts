export type FlashcardId = string;

export interface FlashcardProps {
  id: string;
  rank: number;
  english: string;
  cebuano: string;
  explanation: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Flashcard {
  readonly id: string;
  readonly rank: number;
  readonly english: string;
  readonly cebuano: string;
  readonly explanation: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: FlashcardProps) {
    this.id = props.id;
    this.rank = props.rank;
    this.english = props.english;
    this.cebuano = props.cebuano;
    this.explanation = props.explanation;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
