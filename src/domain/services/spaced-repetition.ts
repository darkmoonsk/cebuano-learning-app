import { Difficulty } from "../value-objects/difficulty-rating";
import { ReviewState } from "../entities/review";

export interface SchedulingResult {
  easeFactor: number;
  interval: number;
  repetitions: number;
  due: Date;
}

const MIN_EASE_FACTOR = 1.3;

export class SpacedRepetitionService {
  // Implements a light-weight SM-2 variant tuned for day-level scheduling
  scheduleNext(state: ReviewState, rating: Difficulty, now: Date): SchedulingResult {
    const quality = this.mapQuality(rating);
    const easeFactor = this.computeEaseFactor(state.easeFactor, quality);
    const repetitions = quality < 3 ? 0 : state.repetitions + 1;
    const interval = this.computeInterval({
      quality,
      repetitions,
      previousInterval: state.interval,
      easeFactor,
    });

    const due = new Date(now);
    due.setDate(due.getDate() + interval);

    return { easeFactor, interval, repetitions, due };
  }

  initialSchedule(rating: Difficulty, now: Date): SchedulingResult {
    const quality = this.mapQuality(rating);
    const easeFactor = Math.max(2.5 + (quality - 3) * 0.1, MIN_EASE_FACTOR);
    const repetitions = quality < 3 ? 0 : 1;
    const interval = quality < 3 ? 1 : quality === 3 ? 1 : 3;
    const due = new Date(now);
    due.setDate(due.getDate() + interval);

    return { easeFactor, interval, repetitions, due };
  }

  private mapQuality(rating: Difficulty) {
    switch (rating) {
      case "again":
        return 1;
      case "hard":
        return 3;
      case "good":
        return 4;
      case "easy":
        return 5;
      default:
        return 3;
    }
  }

  private computeEaseFactor(previousEase: number, quality: number) {
    const nextEase = previousEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    return Math.max(nextEase, MIN_EASE_FACTOR);
  }

  private computeInterval(args: {
    quality: number;
    repetitions: number;
    previousInterval: number;
    easeFactor: number;
  }) {
    const { quality, repetitions, previousInterval, easeFactor } = args;

    if (quality < 3) {
      return 1;
    }

    if (repetitions === 1) {
      return 1;
    }

    if (repetitions === 2) {
      return 6;
    }

    return Math.round(previousInterval * easeFactor);
  }
}
