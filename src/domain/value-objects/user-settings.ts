export interface UserSettings {
  sessionLimit: number;
  newDailyCap: number;
  dailyReviewCap: number;
  lastLearnedRank: number;
}

export const DEFAULT_USER_SETTINGS: Readonly<UserSettings> = {
  sessionLimit: 30,
  newDailyCap: 30,
  dailyReviewCap: 300,
  lastLearnedRank: 0,
} as const;

export function normalizeUserSettings(
  input: Partial<UserSettings> | null | undefined
): UserSettings {
  const safe: Partial<UserSettings> = input ?? {};
  const withLast: Partial<UserSettings> & { lastLearnedRank?: unknown } =
    safe as Partial<UserSettings> & {
      lastLearnedRank?: unknown;
    };
  const sessionLimit =
    Number.isFinite(Number(safe.sessionLimit)) && Number(safe.sessionLimit) > 0
      ? Number(safe.sessionLimit)
      : DEFAULT_USER_SETTINGS.sessionLimit;
  const newDailyCap =
    Number.isFinite(Number(safe.newDailyCap)) && Number(safe.newDailyCap) >= 0
      ? Number(safe.newDailyCap)
      : DEFAULT_USER_SETTINGS.newDailyCap;
  const dailyReviewCap =
    Number.isFinite(Number(safe.dailyReviewCap)) &&
    Number(safe.dailyReviewCap) > 0
      ? Number(safe.dailyReviewCap)
      : DEFAULT_USER_SETTINGS.dailyReviewCap;
  const lastLearnedRank =
    Number.isFinite(Number(withLast.lastLearnedRank)) &&
    Number(withLast.lastLearnedRank) >= 0
      ? Number(withLast.lastLearnedRank)
      : DEFAULT_USER_SETTINGS.lastLearnedRank;
  return { sessionLimit, newDailyCap, dailyReviewCap, lastLearnedRank };
}
