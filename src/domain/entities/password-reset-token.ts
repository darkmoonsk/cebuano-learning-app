export type PasswordResetTokenId = string;

export interface PasswordResetTokenProps {
  id: PasswordResetTokenId;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export class PasswordResetToken {
  readonly id: PasswordResetTokenId;
  readonly userId: string;
  readonly token: string;
  readonly expiresAt: Date;
  readonly createdAt: Date;

  constructor(props: PasswordResetTokenProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.token = props.token;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt;
  }

  isExpired(referenceDate: Date = new Date()): boolean {
    return this.expiresAt.getTime() <= referenceDate.getTime();
  }
}
