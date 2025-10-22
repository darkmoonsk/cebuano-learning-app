export type UserId = string;

export interface UserProps {
  id: UserId;
  email: string;
  hashedPassword: string;
  displayName: string;
  settings?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  readonly id: UserId;
  readonly email: string;
  readonly hashedPassword: string;
  readonly displayName: string;
  readonly settings: unknown;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email.toLowerCase();
    this.hashedPassword = props.hashedPassword;
    this.displayName = props.displayName;
    this.settings = props.settings ?? {};
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
