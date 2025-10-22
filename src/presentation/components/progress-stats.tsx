"use client";

import { Card } from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Badge } from "@/presentation/components/ui/badge";
import { AchievementCard } from "@/presentation/components/achievement-card";
import words from "@/app/data/cebuano_words.json" with { type: "json" };
import {
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";

interface ProgressStatsProps {
  totalLearned: number;
  dueToday: number;
  streak: number;
  userName: string;
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    isUnlocked: boolean;
    unlockedAt?: Date;
    notifiedAt?: Date | null;
    progress?: {
      current: number;
      target: number;
      percentage: number;
    };
  }>;
}

export function ProgressStats({
  totalLearned,
  dueToday,
  streak,
  userName,
  achievements = [],
}: ProgressStatsProps) {
  const totalWords = words.length;
  const completionPercentage = Math.round((totalLearned / totalWords) * 100);
  const wordsRemaining = totalWords - totalLearned;

  // Calculate estimated time to complete based on average learning rate
  const averageWordsPerDay =
    streak > 0 ? Math.max(1, totalLearned / Math.max(streak, 1)) : 0;
  const estimatedDaysToComplete =
    averageWordsPerDay > 0 ? Math.ceil(wordsRemaining / averageWordsPerDay) : 0;

  // Calculate mastery level based on total learned
  const getMasteryLevel = (learned: number) => {
    if (learned >= 3000)
      return {
        level: "Expert",
        color: "bg-purple-500",
        description: "You're a Cebuano vocabulary expert!",
      };
    if (learned >= 2000)
      return {
        level: "Advanced",
        color: "bg-blue-500",
        description: "You have advanced Cebuano vocabulary knowledge!",
      };
    if (learned >= 1000)
      return {
        level: "Intermediate",
        color: "bg-green-500",
        description: "You have solid intermediate vocabulary!",
      };
    if (learned >= 500)
      return {
        level: "Beginner+",
        color: "bg-yellow-500",
        description: "You're building a strong foundation!",
      };
    if (learned >= 100)
      return {
        level: "Beginner",
        color: "bg-orange-500",
        description: "You're getting started with Cebuano!",
      };
    return {
      level: "Getting Started",
      color: "bg-gray-500",
      description: "Ready to begin your Cebuano journey!",
    };
  };

  const mastery = getMasteryLevel(totalLearned);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-[#0077b6] to-[#00b4d8] rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              Great job, {userName.split(" ")[0]}!
            </h2>
            <p className="text-white/80">
              Keep up the excellent work on your Cebuano learning journey.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge className={`${mastery.color} text-white px-3 py-1`}>
            {mastery.level}
          </Badge>
          <span className="text-white/80">{mastery.description}</span>
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Words Learned */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">Words Learned</h3>
              <p className="text-sm text-gray-700">Total vocabulary</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-500">
              {totalLearned.toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">
              of {totalWords.toLocaleString()} total words
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="text-sm text-gray-300">
              {completionPercentage}% complete
            </div>
          </div>
        </Card>

        {/* Due Today */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">Due Today</h3>
              <p className="text-sm text-gray-400">Ready for review</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-500">{dueToday}</div>
            <div className="text-sm text-gray-400">
              {dueToday === 0 ? "All caught up! 🎉" : "Words to review"}
            </div>
          </div>
        </Card>

        {/* Learning Streak */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">Streak</h3>
              <p className="text-sm text-gray-400">Consecutive days</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-500">{streak}</div>
            <div className="text-sm text-gray-400">
              {streak === 0 ? "Start your streak today!" : "Days in a row"}
            </div>
          </div>
        </Card>

        {/* Progress Rate */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-300">Learning Rate</h3>
              <p className="text-sm text-gray-400">Words per day</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-500">
              {averageWordsPerDay > 0 ? averageWordsPerDay.toFixed(1) : "0"}
            </div>
            <div className="text-sm text-gray-400">
              {averageWordsPerDay > 0
                ? "Average daily progress"
                : "Start learning to see your rate"}
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-[#0077b6]" />
            <h3 className="text-lg font-semibold">Completion Progress</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Words learned</span>
              <span className="font-medium text-gray-300">
                {totalLearned.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Words remaining</span>
              <span className="font-medium text-gray-300">
                {wordsRemaining.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">Total words</span>
              <span className="font-medium text-gray-300">
                {totalWords.toLocaleString()}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-400">
                  Overall Progress
                </span>
                <span className="text-sm font-medium text-gray-300">
                  {completionPercentage}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>
          </div>
        </Card>

        {/* Learning Insights */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-[#0077b6]" />
            <h3 className="text-lg font-semibold">Learning Insights</h3>
          </div>

          <div className="space-y-4">
            {estimatedDaysToComplete > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Estimated completion
                  </p>
                  <p className="text-xs text-blue-700">
                    {estimatedDaysToComplete} days at current pace
                  </p>
                </div>
              </div>
            )}

            {streak > 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Current streak
                  </p>
                  <p className="text-xs text-green-700">
                    {streak} consecutive days of learning
                  </p>
                </div>
              </div>
            )}

            {dueToday > 0 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    Review needed
                  </p>
                  <p className="text-xs text-orange-700">
                    {dueToday} words are due for review
                  </p>
                </div>
              </div>
            )}

            {dueToday === 0 && totalLearned > 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    All caught up!
                  </p>
                  <p className="text-xs text-green-700">
                    No words due for review today
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-5 h-5 text-[#0077b6]" />
          <h3 className="text-lg font-semibold">Achievements</h3>
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                id={achievement.id}
                name={achievement.name}
                description={achievement.description}
                icon={achievement.icon}
                category={achievement.category}
                isUnlocked={achievement.isUnlocked}
                unlockedAt={achievement.unlockedAt}
                notifiedAt={achievement.notifiedAt}
                progress={achievement.progress}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No achievements available yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
