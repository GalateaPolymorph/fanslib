/**
 * Standard dimension names used throughout the application
 * These constants provide a single source of truth for dimension names
 * and enable easy updates across the entire frontend codebase
 *
 * MIGRATION NOTE: The FansLib application now uses a generalized tag system
 * with configurable sticker display properties. While these constants are
 * maintained for backward compatibility, new implementations should use:
 *
 * - MediaTileTagStickers component for automatic sticker display
 * - stickerDisplay property on TagDimension ('none', 'color', 'short')
 * - shortRepresentation property on TagDefinition for custom display text
 *
 * This eliminates the need for hardcoded tier/category special handling.
 */

export const TIER_DIMENSION_NAME = "Tier" as const;
export const CATEGORY_DIMENSION_NAME = "Category" as const;

/**
 * All standard dimension names grouped for convenience
 * @deprecated Use the generalized tag system instead of hardcoded dimension handling
 */
export const STANDARD_DIMENSION_NAMES = {
  TIER: TIER_DIMENSION_NAME,
  CATEGORY: CATEGORY_DIMENSION_NAME,
} as const;

/**
 * Tier values for categorical tier system
 * @deprecated Configure these as TagDefinition entities with appropriate shortRepresentation
 */
export const TIER_VALUES = {
  FREE: "Free",
  PAID: "Paid",
  PREMIUM: "Premium",
} as const;

/**
 * Mapping between tier levels and categorical values
 * @deprecated Use TagDefinition entities with shortRepresentation instead
 */
export const TIER_LEVEL_TO_VALUE = {
  0: TIER_VALUES.FREE,
  1: TIER_VALUES.PAID,
  2: TIER_VALUES.PREMIUM,
} as const;

/**
 * Mapping between categorical values and tier levels
 * @deprecated Use TagDefinition entities with shortRepresentation instead
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
 * @deprecated Use TagDefinition entities with shortRepresentation instead
 * Helper function to convert tier level to categorical value
 */
export const getTierValueFromLevel = (level: number): TierValue | null => {
  return TIER_LEVEL_TO_VALUE[level as TierLevel] || null;
};

/**
 * @deprecated Use TagDefinition entities with shortRepresentation instead
 * Helper function to convert categorical value to tier level
 */
export const getTierLevelFromValue = (value: string): number | null => {
  return isValidTierValue(value) ? TIER_VALUE_TO_LEVEL[value] : null;
};
