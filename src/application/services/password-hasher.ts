export interface PasswordHasher {
  hash(raw: string): Promise<string>;
  compare(raw: string, hash: string): Promise<boolean>;
}
