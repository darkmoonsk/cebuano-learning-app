export class EmailAddress {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!/^[\w.!#$%&’*+/=?`{|}~-]+@[\w-]+(\.[\w-]+)+$/.test(normalized)) {
      throw new Error("Invalid email address");
    }
    return new EmailAddress(normalized);
  }
}
