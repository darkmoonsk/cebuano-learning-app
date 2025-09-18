export type Difficulty = "again" | "hard" | "good" | "easy";

export const difficultyWeights: Record<Difficulty, number> = {
  again: 0,
  hard: 2,
  good: 3,
  easy: 5,
};

export const difficultyLabels: Record<Difficulty, string> = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy",
};
