import { UserRepository } from "@/domain/repositories/user-repository";
import { PasswordHasher } from "../services/password-hasher";

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: AuthenticateUserInput) {
    const user = await this.userRepository.findByEmail(input.email.toLowerCase());

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await this.passwordHasher.compare(input.password, user.hashedPassword);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
}
