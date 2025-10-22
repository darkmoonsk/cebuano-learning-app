"use client";

import { Card } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Progress } from "@/presentation/components/ui/progress";
import { CheckCircle, Lock } from "lucide-react";

interface AchievementCardProps {
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
}

export function AchievementCard({
  id,
  name,
  description,
  icon,
  category,
  isUnlocked,
  unlockedAt,
  notifiedAt,
  progress,
}: AchievementCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "learning":
        return "bg-green-500";
      case "reviews":
        return "bg-blue-500";
      case "streaks":
        return "bg-orange-500";
      case "time-based":
        return "bg-purple-500";
      case "perfect-reviews":
        return "bg-pink-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case "learning":
        return "Learning";
      case "reviews":
        return "Reviews";
      case "streaks":
        return "Streaks";
      case "time-based":
        return "Time-based";
      case "perfect-reviews":
        return "Perfect Reviews";
      default:
        return category;
    }
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 ${
        isUnlocked
          ? "border-green-200 bg-green-50 hover:bg-green-100"
          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
            isUnlocked ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          {isUnlocked ? icon : "🔒"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className={`font-medium text-sm ${
                isUnlocked ? "text-green-900" : "text-gray-700"
              }`}
            >
              {name}
            </h4>
            {isUnlocked && <CheckCircle className="w-4 h-4 text-green-600" />}
          </div>

          <p
            className={`text-xs mb-2 ${
              isUnlocked ? "text-green-700" : "text-gray-600"
            }`}
          >
            {description}
          </p>

          {/* Category Badge */}
          <div className="mb-2">
            <Badge
              className={`${getCategoryColor(category)} text-white text-xs`}
            >
              {getCategoryName(category)}
            </Badge>
          </div>

          {/* Progress or Unlock Info */}
          {isUnlocked ? (
            <div className="text-xs text-green-600">
              Unlocked{" "}
              {unlockedAt
                ? new Date(unlockedAt).toLocaleDateString()
                : "recently"}
            </div>
          ) : progress ? (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>
                  {progress.current}/{progress.target}
                </span>
              </div>
              <Progress value={progress.percentage} className="h-1" />
              <div className="text-xs text-gray-500">
                {progress.percentage}% complete
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              Start learning to unlock
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
