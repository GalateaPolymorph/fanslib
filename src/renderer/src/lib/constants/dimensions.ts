/**
 * Standard dimension names used throughout the application
 * These constants provide a single source of truth for dimension names
 * and enable easy updates across the entire frontend codebase
 */

export const TIER_DIMENSION_NAME = "Tier" as const;
export const CATEGORY_DIMENSION_NAME = "Category" as const;

/**
 * All standard dimension names grouped for convenience
 */
export const STANDARD_DIMENSION_NAMES = {
  TIER: TIER_DIMENSION_NAME,
  CATEGORY: CATEGORY_DIMENSION_NAME,
} as const;

/**
 * Tier values for categorical tier system
 */
export const TIER_VALUES = {
  FREE: "Free",
  PAID: "Paid",
  PREMIUM: "Premium",
} as const;

/**
 * Mapping between tier levels and categorical values
 */
export const TIER_LEVEL_TO_VALUE = {
  0: TIER_VALUES.FREE,
  1: TIER_VALUES.PAID,
  2: TIER_VALUES.PREMIUM,
} as const;

/**
 * Mapping between categorical values and tier levels
 */
export const TIER_VALUE_TO_LEVEL = {
  [TIER_VALUES.FREE]: 0,
  [TIER_VALUES.PAID]: 1,
  [TIER_VALUES.PREMIUM]: 2,
} as const;

/**
 * Type definitions for dimension names
 */
export type TierDimensionName = typeof TIER_DIMENSION_NAME;
export type CategoryDimensionName = typeof CATEGORY_DIMENSION_NAME;
export type StandardDimensionName = TierDimensionName | CategoryDimensionName;

/**
 * Type definitions for tier values
 */
export type TierValue = (typeof TIER_VALUES)[keyof typeof TIER_VALUES];
export type TierLevel = keyof typeof TIER_LEVEL_TO_VALUE;

/**
 * Helper function to validate if a string is a valid dimension name
 */
export const isValidDimensionName = (name: string): name is StandardDimensionName => {
  return name === TIER_DIMENSION_NAME || name === CATEGORY_DIMENSION_NAME;
};

/**
 * Helper function to validate if a string is a valid tier value
 */
export const isValidTierValue = (value: string): value is TierValue => {
  return Object.values(TIER_VALUES).includes(value as TierValue);
};

/**
 * Helper function to convert tier level to categorical value
 */
export const getTierValueFromLevel = (level: number): TierValue | null => {
  return TIER_LEVEL_TO_VALUE[level as TierLevel] || null;
};

/**
 * Helper function to convert categorical value to tier level
 */
export const getTierLevelFromValue = (value: string): number | null => {
  return isValidTierValue(value) ? TIER_VALUE_TO_LEVEL[value] : null;
};
