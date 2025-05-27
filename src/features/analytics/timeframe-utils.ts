import { db } from "src/lib/db";
import { AnalyticsFetchHistory } from "./entity";

export type TimeframeClassification = {
  type: "rolling" | "fixed";
  identifier: string;
  ttlHours?: number;
};

/**
 * Classify a timeframe as "rolling" (needs regular updates) or "fixed" (permanent once fetched)
 * Rolling timeframes like "Last 30 days" need TTL, fixed ones like "November 2024" don't
 */
export const classifyTimeframe = (startDate: Date, endDate: Date): TimeframeClassification => {
  const now = new Date();
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

  // Check if this is a recent rolling window (ends within 7 days of now)
  const daysSinceEnd = Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  const isRecent = Math.abs(daysSinceEnd) <= 7;

  // Rolling timeframes: recent windows that are commonly used durations
  const isRolling =
    isRecent &&
    (durationDays === 1 || // Last day
      durationDays === 7 || // Last week
      durationDays === 30 || // Last 30 days
      durationDays === 90); // Last 3 months

  if (isRolling) {
    return {
      type: "rolling",
      identifier: `rolling-${durationDays}d`,
      ttlHours: 24, // 24 hour TTL for rolling timeframes
    };
  }

  // Fixed timeframes: use month-year for identification
  const startMonth = startDate.getUTCMonth() + 1; // 1-based month
  const startYear = startDate.getUTCFullYear();
  const endMonth = endDate.getUTCMonth() + 1;
  const endYear = endDate.getUTCFullYear();

  // If it spans multiple months, create a range identifier
  const identifier =
    startMonth === endMonth && startYear === endYear
      ? `fixed-${startYear}-${startMonth.toString().padStart(2, "0")}`
      : `fixed-${startYear}-${startMonth.toString().padStart(2, "0")}-to-${endYear}-${endMonth.toString().padStart(2, "0")}`;

  return {
    type: "fixed",
    identifier,
    // No TTL for fixed timeframes - they're permanent once fetched
  };
};

/**
 * Check if a fetch record has expired based on TTL
 */
export const isFetchExpired = (expiresAt?: Date): boolean => {
  if (!expiresAt) {
    // No expiration date means it never expires (fixed timeframes)
    return false;
  }

  return new Date() > expiresAt;
};

/**
 * Clean up expired fetch history records to prevent database bloat
 * This should be called periodically (e.g., daily)
 */
export const cleanupExpiredFetchHistory = async (): Promise<number> => {
  const dataSource = await db();
  const fetchHistoryRepository = dataSource.getRepository(AnalyticsFetchHistory);

  const now = new Date();

  // Delete all expired rolling timeframe records
  const result = await fetchHistoryRepository
    .createQueryBuilder()
    .delete()
    .where("expiresAt IS NOT NULL")
    .andWhere("expiresAt < :now", { now })
    .execute();

  const deletedCount = result.affected || 0;
  console.log(`Cleaned up ${deletedCount} expired analytics fetch history records`);

  return deletedCount;
};
