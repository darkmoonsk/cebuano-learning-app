import { EmailAddress } from "@/domain/value-objects/email";
import { UserRepository } from "@/domain/repositories/user-repository";
import { PasswordHasher } from "../services/password-hasher";

export interface RegisterUserInput {
  email: string;
  password: string;
  displayName: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput) {
    const email = EmailAddress.create(input.email);
    const existing = await this.userRepository.findByEmail(email.value);

    if (existing) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.create({
      email: email.value,
      hashedPassword,
      displayName: input.displayName,
    });

    return user;
  }
}
