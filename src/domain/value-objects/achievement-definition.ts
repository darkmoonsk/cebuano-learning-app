export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  criteria: AchievementCriteria;
}

export type AchievementCategory =
  | "learning"
  | "reviews"
  | "streaks"
  | "time-based"
  | "perfect-reviews";

export interface AchievementCriteria {
  type:
    | "words_learned"
    | "total_reviews"
    | "perfect_reviews"
    | "streak_days"
    | "review_time";
  threshold: number;
  timeWindow?: "daily" | "weekly" | "monthly" | "all_time";
  timeOfDay?: "early_morning" | "late_night" | "weekend";
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Learning Milestones
  {
    id: "first_steps",
    name: "First Steps",
    description: "Learn 10 words",
    icon: "🌱",
    category: "learning",
    criteria: { type: "words_learned", threshold: 10 },
  },
  {
    id: "getting_started",
    name: "Getting Started",
    description: "Learn 50 words",
    icon: "📚",
    category: "learning",
    criteria: { type: "words_learned", threshold: 50 },
  },
  {
    id: "building_momentum",
    name: "Building Momentum",
    description: "Learn 100 words",
    icon: "🚀",
    category: "learning",
    criteria: { type: "words_learned", threshold: 100 },
  },
  {
    id: "making_progress",
    name: "Making Progress",
    description: "Learn 500 words",
    icon: "⭐",
    category: "learning",
    criteria: { type: "words_learned", threshold: 500 },
  },
  {
    id: "halfway_there",
    name: "Halfway There",
    description: "Learn 1,000 words",
    icon: "🎯",
    category: "learning",
    criteria: { type: "words_learned", threshold: 1000 },
  },
  {
    id: "advanced_learner",
    name: "Advanced Learner",
    description: "Learn 2,000 words",
    icon: "🏆",
    category: "learning",
    criteria: { type: "words_learned", threshold: 2000 },
  },
  {
    id: "vocabulary_master",
    name: "Vocabulary Master",
    description: "Learn 3,000 words",
    icon: "👑",
    category: "learning",
    criteria: { type: "words_learned", threshold: 3000 },
  },

  // Review Achievements
  {
    id: "reviewer",
    name: "Reviewer",
    description: "Complete 100 reviews",
    icon: "📝",
    category: "reviews",
    criteria: { type: "total_reviews", threshold: 100 },
  },
  {
    id: "dedicated_reviewer",
    name: "Dedicated Reviewer",
    description: "Complete 500 reviews",
    icon: "📖",
    category: "reviews",
    criteria: { type: "total_reviews", threshold: 500 },
  },
  {
    id: "review_master",
    name: "Review Master",
    description: "Complete 1,000 reviews",
    icon: "📚",
    category: "reviews",
    criteria: { type: "total_reviews", threshold: 1000 },
  },
  {
    id: "review_legend",
    name: "Review Legend",
    description: "Complete 5,000 reviews",
    icon: "🏅",
    category: "reviews",
    criteria: { type: "total_reviews", threshold: 5000 },
  },

  // Perfect Review Achievements
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Get 10 perfect reviews in a row",
    icon: "✨",
    category: "perfect-reviews",
    criteria: { type: "perfect_reviews", threshold: 10 },
  },
  {
    id: "flawless_master",
    name: "Flawless Master",
    description: "Get 50 perfect reviews in a row",
    icon: "💎",
    category: "perfect-reviews",
    criteria: { type: "perfect_reviews", threshold: 50 },
  },

  // Streak Achievements
  {
    id: "streak_starter",
    name: "Streak Starter",
    description: "3-day learning streak",
    icon: "🔥",
    category: "streaks",
    criteria: { type: "streak_days", threshold: 3 },
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "7-day learning streak",
    icon: "⚡",
    category: "streaks",
    criteria: { type: "streak_days", threshold: 7 },
  },
  {
    id: "streak_champion",
    name: "Streak Champion",
    description: "14-day learning streak",
    icon: "🌟",
    category: "streaks",
    criteria: { type: "streak_days", threshold: 14 },
  },
  {
    id: "streak_legend",
    name: "Streak Legend",
    description: "30-day learning streak",
    icon: "👑",
    category: "streaks",
    criteria: { type: "streak_days", threshold: 30 },
  },

  // Time-based Achievements
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Review before 8 AM",
    icon: "🐦",
    category: "time-based",
    criteria: { type: "review_time", threshold: 1, timeOfDay: "early_morning" },
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Review after 10 PM",
    icon: "🦉",
    category: "time-based",
    criteria: { type: "review_time", threshold: 1, timeOfDay: "late_night" },
  },
  {
    id: "weekend_warrior",
    name: "Weekend Warrior",
    description: "Review on weekends",
    icon: "⚔️",
    category: "time-based",
    criteria: { type: "review_time", threshold: 1, timeOfDay: "weekend" },
  },
];

export function getAchievementById(
  id: string
): AchievementDefinition | undefined {
  return ACHIEVEMENT_DEFINITIONS.find((achievement) => achievement.id === id);
}

export function getAchievementsByCategory(
  category: AchievementCategory
): AchievementDefinition[] {
  return ACHIEVEMENT_DEFINITIONS.filter(
    (achievement) => achievement.category === category
  );
}

export function getAllAchievementCategories(): AchievementCategory[] {
  return ["learning", "reviews", "streaks", "time-based", "perfect-reviews"];
}
