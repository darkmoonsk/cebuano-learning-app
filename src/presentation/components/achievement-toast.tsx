"use client";

import { useEffect, useState } from "react";
import { Card } from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { X, Trophy } from "lucide-react";

interface AchievementToastProps {
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    unlockedAt: Date;
  };
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function AchievementToast({
  achievement,
  onClose,
  autoClose = true,
  duration = 5000,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

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

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isAnimating ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
    >
      <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg max-w-sm">
        <div className="flex items-start gap-3">
          {/* Achievement Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl animate-pulse">
            {achievement.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-900">
                Achievement Unlocked!
              </span>
            </div>

            <h4 className="font-bold text-lg text-gray-900 mb-1">
              {achievement.name}
            </h4>

            <p className="text-sm text-gray-700 mb-2">
              {achievement.description}
            </p>

            <div className="flex items-center gap-2">
              <Badge
                className={`${getCategoryColor(achievement.category)} text-white text-xs`}
              >
                {achievement.category}
              </Badge>
              <span className="text-xs text-gray-500">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Celebration Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-ping rounded-lg" />
        </div>
      </Card>
    </div>
  );
}

interface AchievementToastContainerProps {
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    unlockedAt: Date;
  }>;
  onClose: (achievementId: string) => void;
}

export function AchievementToastContainer({
  achievements,
  onClose,
}: AchievementToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {achievements.map((achievement, index) => (
        <div
          key={achievement.id}
          className="transition-all duration-300"
          style={{
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index,
          }}
        >
          <AchievementToast
            achievement={achievement}
            onClose={() => onClose(achievement.id)}
            autoClose={true}
            duration={6000}
          />
        </div>
      ))}
    </div>
  );
}
