import { describe, expect, it, vi } from "vitest";
import { GetDueFlashcardsUseCase } from "../get-due-flashcards";
import type { ReviewRepository } from "@/domain/repositories/review-repository";
import type { FlashcardRepository } from "@/domain/repositories/flashcard-repository";
import { ReviewState } from "@/domain/entities/review";
import { Flashcard } from "@/domain/entities/flashcard";

const baseDate = new Date("2024-01-01T00:00:00.000Z");

const createReviewState = (flashcardId: string) =>
  new ReviewState({
    id: `review-${flashcardId}`,
    userId: "user-1",
    flashcardId,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    due: new Date(baseDate),
    lastReviewedAt: null,
    createdAt: new Date(baseDate),
    updatedAt: new Date(baseDate),
  });

const createFlashcard = (id: string) =>
  new Flashcard({
    id,
    english: `English ${id}`,
    cebuano: `Cebuano ${id}`,
    partOfSpeech: "noun",
    level: "A1",
    isActive: true,
    createdAt: new Date(baseDate),
    updatedAt: new Date(baseDate),
  });

describe("GetDueFlashcardsUseCase", () => {
  it("supplements missing flashcards with additional due items", async () => {
    const reviewStates = [
      createReviewState("card-1"),
      createReviewState("card-2"),
    ];

    const findDueByUserSpy = vi.fn().mockResolvedValue(reviewStates);
    const reviewRepository = {
      findDueByUser: findDueByUserSpy,
      findByUserAndFlashcard: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      getProgressSnapshot: vi.fn(),
      countIntroductionsOnDate: vi.fn().mockResolvedValue(0),
    } as unknown as ReviewRepository;

    const flashcardOne = createFlashcard("card-1");
    const additionalFlashcard = createFlashcard("card-3");

    const findByIdSpy = vi
      .fn()
      .mockImplementation(async (id: string) =>
        id === "card-1" ? flashcardOne : null
      );
    const findDueForUserSpy = vi.fn().mockResolvedValue([additionalFlashcard]);

    const flashcardRepository = {
      findById: findByIdSpy,
      findDueForUser: findDueForUserSpy,
      listAllActive: vi.fn(),
    } as unknown as FlashcardRepository;

    const useCase = new GetDueFlashcardsUseCase(
      reviewRepository,
      flashcardRepository
    );

    const result = await useCase.execute({ userId: "user-1", limit: 2 });

    expect(findDueByUserSpy).toHaveBeenCalledTimes(1);
    const [, nowArg, limitArg] = findDueByUserSpy.mock.calls[0];
    expect(limitArg).toBe(2);
    expect(nowArg).toBeInstanceOf(Date);

    expect(findByIdSpy).toHaveBeenCalledTimes(2);
    expect(findDueForUserSpy).toHaveBeenCalledWith("user-1", 1);
    expect(result.due.map((card) => card.id)).toEqual(["card-1", "card-3"]);
  });

  it("tops up results to the default limit when there are fewer scheduled reviews", async () => {
    const reviewStates = [
      createReviewState("card-1"),
      createReviewState("card-2"),
    ];

    const findDueByUserSpy = vi.fn().mockResolvedValue(reviewStates);
    const reviewRepository = {
      findDueByUser: findDueByUserSpy,
      findByUserAndFlashcard: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      getProgressSnapshot: vi.fn(),
      countIntroductionsOnDate: vi.fn().mockResolvedValue(0),
    } as unknown as ReviewRepository;

    const flashcards = [createFlashcard("card-1"), createFlashcard("card-2")];

    const findByIdSpy = vi
      .fn()
      .mockImplementation(
        async (id: string) => flashcards.find((card) => card.id === id) ?? null
      );
    const findDueForUserSpy = vi.fn().mockResolvedValue([]);

    const flashcardRepository = {
      findById: findByIdSpy,
      findDueForUser: findDueForUserSpy,
      listAllActive: vi.fn(),
    } as unknown as FlashcardRepository;

    const useCase = new GetDueFlashcardsUseCase(
      reviewRepository,
      flashcardRepository
    );

    const result = await useCase.execute({ userId: "user-2" });

    expect(findDueByUserSpy).toHaveBeenCalledTimes(1);
    const [, , limitArg] = findDueByUserSpy.mock.calls[0];
    expect(limitArg).toBe(10);
    expect(findDueForUserSpy).toHaveBeenCalledWith("user-2", 8);
    expect(result.due.map((card) => card.id)).toEqual(["card-1", "card-2"]);
  });

  it("does not top up with new cards when daily new cap is reached", async () => {
    const reviewStates = [createReviewState("card-1")];

    const findDueByUserSpy = vi.fn().mockResolvedValue(reviewStates);
    const reviewRepository = {
      findDueByUser: findDueByUserSpy,
      findByUserAndFlashcard: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      getProgressSnapshot: vi.fn(),
      countIntroductionsOnDate: vi.fn().mockResolvedValue(10),
    } as unknown as ReviewRepository;

    const flashcardOne = createFlashcard("card-1");
    const findByIdSpy = vi.fn().mockResolvedValue(flashcardOne);
    const findDueForUserSpy = vi.fn();

    const flashcardRepository = {
      findById: findByIdSpy,
      findDueForUser: findDueForUserSpy,
      listAllActive: vi.fn(),
    } as unknown as FlashcardRepository;

    const useCase = new GetDueFlashcardsUseCase(
      reviewRepository,
      flashcardRepository
    );

    const result = await useCase.execute({ userId: "user-3", limit: 5 });

    expect(findDueByUserSpy).toHaveBeenCalledTimes(1);
    expect(findByIdSpy).toHaveBeenCalledTimes(1);
    expect(findDueForUserSpy).not.toHaveBeenCalled();
    expect(result.due.map((card) => card.id)).toEqual(["card-1"]);
  });
});
