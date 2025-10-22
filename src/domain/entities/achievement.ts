export interface AchievementProps {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  notifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Achievement {
  readonly id: string;
  readonly userId: string;
  readonly achievementId: string;
  readonly unlockedAt: Date;
  readonly notifiedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: AchievementProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.achievementId = props.achievementId;
    this.unlockedAt = props.unlockedAt;
    this.notifiedAt = props.notifiedAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  markAsNotified(): Achievement {
    return new Achievement({
      ...this,
      notifiedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  isNotified(): boolean {
    return this.notifiedAt !== null;
  }
}
