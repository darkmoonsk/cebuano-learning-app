import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { RecordReviewUseCase } from "../record-review";
import type { ReviewRepository } from "@/domain/repositories/review-repository";
import type { SpacedRepetitionService, SchedulingResult } from "@/domain/services/spaced-repetition";
import { ReviewState } from "@/domain/entities/review";

const buildReviewState = (overrides: Partial<ReviewState> = {}) => {
  const base = new ReviewState({
    id: "review-1",
    userId: "user-1",
    flashcardId: "card-1",
    easeFactor: 2.5,
    interval: 6,
    repetitions: 2,
    due: new Date("2023-12-31T00:00:00.000Z"),
    lastReviewedAt: new Date("2023-12-31T00:00:00.000Z"),
    createdAt: new Date("2023-12-01T00:00:00.000Z"),
    updatedAt: new Date("2023-12-15T00:00:00.000Z"),
  });

  return Object.assign(base, overrides);
};

describe("RecordReviewUseCase", () => {
  const currentTime = new Date("2024-01-02T08:00:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(currentTime);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("creates a new review using the initial spaced repetition schedule", async () => {
    const schedule: SchedulingResult = {
      easeFactor: 2.6,
      interval: 3,
      repetitions: 1,
      due: new Date("2024-01-05T08:00:00.000Z"),
    };

    const createdState = buildReviewState({
      id: "review-created",
      flashcardId: "card-42",
      due: schedule.due,
      easeFactor: schedule.easeFactor,
      interval: schedule.interval,
      repetitions: schedule.repetitions,
      lastReviewedAt: new Date(currentTime),
    });

    const createSpy = vi.fn().mockResolvedValue(createdState);

    const reviewRepository = {
      findByUserAndFlashcard: vi.fn().mockResolvedValue(null),
      findDueByUser: vi.fn(),
      create: createSpy,
      update: vi.fn(),
      getProgressSnapshot: vi.fn(),
    } as unknown as ReviewRepository;

    const initialScheduleSpy = vi.fn().mockReturnValue(schedule);
    const spacedRepetitionService = {
      initialSchedule: initialScheduleSpy,
      scheduleNext: vi.fn(),
    } as unknown as SpacedRepetitionService;

    const useCase = new RecordReviewUseCase(reviewRepository, spacedRepetitionService);

    const result = await useCase.execute({
      userId: "user-1",
      flashcardId: "card-42",
      rating: "good",
    });

    expect(initialScheduleSpy).toHaveBeenCalledTimes(1);
    const [ratingArg, initialCallDate] = initialScheduleSpy.mock.calls[0];
    expect(ratingArg).toBe("good");
    expect(initialCallDate).toBeInstanceOf(Date);
    expect((initialCallDate as Date).getTime()).toBe(currentTime.getTime());

    expect(createSpy).toHaveBeenCalledTimes(1);

    const [payload, rating] = createSpy.mock.calls[0];
    expect(rating).toBe("good");
    expect(payload.flashcardId).toBe("card-42");
    expect(payload.easeFactor).toBe(schedule.easeFactor);
    expect(payload.interval).toBe(schedule.interval);
    expect(payload.repetitions).toBe(schedule.repetitions);
    expect(payload.due).toEqual(schedule.due);
    expect(payload.lastReviewedAt).toBeInstanceOf(Date);
    expect((payload.lastReviewedAt as Date).getTime()).toBe(currentTime.getTime());

    expect(result).toBe(createdState);
  });

  it("updates an existing review using the next spaced repetition schedule", async () => {
    const existingState = buildReviewState({ id: "review-existing", flashcardId: "card-5" });
    const schedule: SchedulingResult = {
      easeFactor: 2.4,
      interval: 1,
      repetitions: 0,
      due: new Date("2024-01-03T08:00:00.000Z"),
    };

    const updatedState = buildReviewState({
      id: existingState.id,
      flashcardId: existingState.flashcardId,
      due: schedule.due,
      easeFactor: schedule.easeFactor,
      interval: schedule.interval,
      repetitions: schedule.repetitions,
      lastReviewedAt: new Date(currentTime),
    });

    const updateSpy = vi.fn().mockResolvedValue(updatedState);

    const reviewRepository = {
      findByUserAndFlashcard: vi.fn().mockResolvedValue(existingState),
      findDueByUser: vi.fn(),
      create: vi.fn(),
      update: updateSpy,
      getProgressSnapshot: vi.fn(),
    } as unknown as ReviewRepository;

    const scheduleNextSpy = vi.fn().mockReturnValue(schedule);
    const spacedRepetitionService = {
      initialSchedule: vi.fn(),
      scheduleNext: scheduleNextSpy,
    } as unknown as SpacedRepetitionService;

    const useCase = new RecordReviewUseCase(reviewRepository, spacedRepetitionService);

    const result = await useCase.execute({
      userId: "user-1",
      flashcardId: "card-5",
      rating: "again",
    });

    expect(scheduleNextSpy).toHaveBeenCalledTimes(1);
    const [stateArg, ratingArg, scheduleCallDate] = scheduleNextSpy.mock.calls[0];
    expect(stateArg).toBe(existingState);
    expect(ratingArg).toBe("again");
    expect(scheduleCallDate).toBeInstanceOf(Date);
    expect((scheduleCallDate as Date).getTime()).toBe(currentTime.getTime());

    expect(updateSpy).toHaveBeenCalledTimes(1);

    const [id, payload, rating] = updateSpy.mock.calls[0];
    expect(id).toBe(existingState.id);
    expect(rating).toBe("again");
    expect(payload.easeFactor).toBe(schedule.easeFactor);
    expect(payload.interval).toBe(schedule.interval);
    expect(payload.repetitions).toBe(schedule.repetitions);
    expect(payload.due).toEqual(schedule.due);
    expect((payload.lastReviewedAt as Date).getTime()).toBe(currentTime.getTime());

    expect(result).toBe(updatedState);
  });
});
