export type PhraseId = string;

export interface PhraseProps {
  id: string;
  cebuano: string;
  english: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Phrase {
  readonly id: string;
  readonly cebuano: string;
  readonly english: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: PhraseProps) {
    this.id = props.id;
    this.cebuano = props.cebuano;
    this.english = props.english;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
