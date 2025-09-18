import { describe, expect, it, vi } from "vitest";
import { RegisterUserUseCase } from "../register-user";
import type { UserRepository } from "@/domain/repositories/user-repository";
import type { PasswordHasher } from "@/application/services/password-hasher";
import { User } from "@/domain/entities/user";

const buildUser = (overrides: Partial<User> = {}) => {
  const base = new User({
    id: "user-1",
    email: "test@example.com",
    hashedPassword: "hashed-value",
    displayName: "Tester",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  });

  return Object.assign(base, overrides);
};

describe("RegisterUserUseCase", () => {
  it("hashes the password and stores the normalized email when registration succeeds", async () => {
    const createdUser = buildUser();

    const findByEmailSpy = vi.fn().mockResolvedValue(null);
    const createSpy = vi.fn().mockResolvedValue(createdUser);

    const userRepository = {
      findByEmail: findByEmailSpy,
      findById: vi.fn(),
      create: createSpy,
    } as unknown as UserRepository;

    const passwordHasher = {
      hash: vi.fn().mockResolvedValue("hashed-secret"),
      compare: vi.fn(),
    } as unknown as PasswordHasher;

    const useCase = new RegisterUserUseCase(userRepository, passwordHasher);

    const result = await useCase.execute({
      email: "  Test@Example.COM  ",
      password: "super-secret",
      displayName: "Tester",
    });

    expect(findByEmailSpy).toHaveBeenCalledWith("test@example.com");
    expect(passwordHasher.hash).toHaveBeenCalledWith("super-secret");

    const [payload] = createSpy.mock.calls[0];
    expect(payload).toEqual({
      email: "test@example.com",
      hashedPassword: "hashed-secret",
      displayName: "Tester",
    });

    expect(result).toBe(createdUser);
  });

  it("throws when the email is already registered", async () => {
    const existingUser = buildUser();

    const userRepository = {
      findByEmail: vi.fn().mockResolvedValue(existingUser),
      findById: vi.fn(),
      create: vi.fn(),
    } as unknown as UserRepository;

    const passwordHasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    } as unknown as PasswordHasher;

    const useCase = new RegisterUserUseCase(userRepository, passwordHasher);

    await expect(
      useCase.execute({
        email: "test@example.com",
        password: "whatever",
        displayName: "Tester",
      }),
    ).rejects.toThrow("Email already registered");

    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});
