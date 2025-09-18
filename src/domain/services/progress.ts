export interface ProgressSnapshot {
  totalLearned: number;
  dueToday: number;
  streak: number;
}

export class ProgressService {
  compute(snapshot: { reviewsCompleted: number; consecutiveDays: number; dueCount: number; }): ProgressSnapshot {
    return {
      totalLearned: snapshot.reviewsCompleted,
      dueToday: snapshot.dueCount,
      streak: snapshot.consecutiveDays,
    };
  }
}
