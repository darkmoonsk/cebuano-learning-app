import { describe, expect, it } from "vitest";
import { SpacedRepetitionService } from "./spaced-repetition";
import { ReviewState } from "../entities/review";

const baseDate = new Date("2024-01-01T00:00:00.000Z");

const createReviewState = () =>
  new ReviewState({
    id: "review-1",
    userId: "user-1",
    flashcardId: "card-1",
    easeFactor: 2.5,
    interval: 6,
    repetitions: 2,
    due: new Date(baseDate),
    lastReviewedAt: new Date(baseDate),
    createdAt: new Date(baseDate),
    updatedAt: new Date(baseDate),
  });

describe("SpacedRepetitionService", () => {
  const service = new SpacedRepetitionService();

  it("computes an initial schedule for 'again' ratings", () => {
    const result = service.initialSchedule("again", baseDate);

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(0);
    expect(result.easeFactor).toBeCloseTo(2.3, 5);
    expect(result.due.getTime()).toBe(baseDate.getTime() + 24 * 60 * 60 * 1000);
  });

  it("computes an initial schedule for 'good' ratings", () => {
    const result = service.initialSchedule("good", baseDate);

    expect(result.interval).toBe(3);
    expect(result.repetitions).toBe(1);
    expect(result.easeFactor).toBeCloseTo(2.6, 5);
    expect(result.due.getTime()).toBe(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  });

  it("schedules the next review using previous state and rating", () => {
    const state = createReviewState();
    const result = service.scheduleNext(state, "easy", baseDate);

    expect(result.repetitions).toBe(3);
    expect(result.interval).toBe(16);
    expect(result.easeFactor).toBeCloseTo(2.6, 5);
    expect(result.due.getTime()).toBe(baseDate.getTime() + 16 * 24 * 60 * 60 * 1000);
  });

  it("resets repetitions when the user rates 'again'", () => {
    const state = createReviewState();
    const result = service.scheduleNext(state, "again", baseDate);

    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    expect(result.due.getTime()).toBe(baseDate.getTime() + 24 * 60 * 60 * 1000);
  });
});
