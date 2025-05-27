import { MediaTag } from "../../../features/tags/entity";
import { TagSelectionState } from "../components/TagSelector";
import { CATEGORY_DIMENSION_NAME, TIER_DIMENSION_NAME } from "./constants/dimensions";

// Tier value mappings
const TIER_VALUE_TO_LEVEL = {
  Free: 0,
  Paid: 1,
  Premium: 2,
} as const;

// Helper function to convert categorical value to tier level
const getTierLevelFromValue = (value: string): number | null => {
  return TIER_VALUE_TO_LEVEL[value as keyof typeof TIER_VALUE_TO_LEVEL] ?? null;
};

/**
 * Get media tags for a specific dimension by name
 */
export const getMediaTagsForDimension = (
  mediaTags: MediaTag[],
  dimensionName: string
): MediaTag[] => {
  return mediaTags.filter((tag) => tag.dimensionName === dimensionName);
};

/**
 * Get the first media tag for a specific dimension (useful for single-value dimensions like Content Quality)
 */
export const getMediaTagForDimension = (
  mediaTags: MediaTag[],
  dimensionName: string
): MediaTag | undefined => {
  return mediaTags.find((tag) => tag.dimensionName === dimensionName);
};

/**
 * Convert media tags to TagSelectionState format for TagSelector
 */
export const mediaTagsToSelectionState = (mediaTags: MediaTag[]): TagSelectionState[] => {
  return mediaTags.map((tag) => ({
    id: tag.tagDefinitionId || parseFloat(tag.tagValue),
    state: "selected" as const,
  }));
};

/**
 * @deprecated Use the generalized tag system with stickerDisplay configuration instead.
 * For display purposes, use MediaTileTagStickers component which automatically handles
 * all tags with shortRepresentation configured.
 *
 * Get Tier value from media tags (returns the categorical value: Free, Paid, Premium)
 */
export const getTierValue = (mediaTags: MediaTag[]): string | null => {
  const tierTag = getMediaTagForDimension(mediaTags, TIER_DIMENSION_NAME);
  if (!tierTag) return null;

  return tierTag.tagValue;
};

/**
 * @deprecated Use the generalized tag system with stickerDisplay configuration instead.
 * For display purposes, use MediaTileTagStickers component which automatically handles
 * all tags with shortRepresentation configured.
 *
 * Get Tier level from media tags (returns the numerical level: 0, 1, 2)
 */
export const getTierLevel = (mediaTags: MediaTag[]): number | null => {
  const tierValue = getTierValue(mediaTags);
  if (!tierValue) return null;

  return getTierLevelFromValue(tierValue);
};

/**
 * @deprecated Use the generalized tag system with stickerDisplay configuration instead.
 * For display purposes, use MediaTileTagStickers component which automatically handles
 * all tags with color display configured.
 *
 * Get Category tags from media tags
 */
export const getCategoryTags = (mediaTags: MediaTag[]): MediaTag[] => {
  return getMediaTagsForDimension(mediaTags, CATEGORY_DIMENSION_NAME);
};

/**
 * Check if media has a specific tier value
 */
export const hasMediaTierValue = (mediaTags: MediaTag[], tierValue: string): boolean => {
  const currentTierValue = getTierValue(mediaTags);
  return currentTierValue === tierValue;
};

/**
 * Check if media has a specific tier level
 */
export const hasMediaTierLevel = (mediaTags: MediaTag[], level: number): boolean => {
  const currentLevel = getTierLevel(mediaTags);
  return currentLevel === level;
};

/**
 * @deprecated Use the generalized tag system with stickerDisplay configuration instead.
 * For display purposes, use MediaTileTagStickers component which automatically handles
 * all tags with color display configured.
 *
 * Get category slugs from media tags
 */
export const getCategorySlugs = (mediaTags: MediaTag[]): string[] => {
  const categoryTags = getCategoryTags(mediaTags);
  return categoryTags.map((tag) => tag.tagValue);
};

// Backward compatibility functions
/**
 * @deprecated Use getTierLevel instead
 * Get Content Quality level from media tags (returns the numerical value)
 */
export const getContentQualityLevel = (mediaTags: MediaTag[]): number | null => {
  return getTierLevel(mediaTags);
};

/**
 * @deprecated Use getCategoryTags instead
 * Get Content Category tags from media tags
 */
export const getContentCategoryTags = (mediaTags: MediaTag[]): MediaTag[] => {
  return getCategoryTags(mediaTags);
};

/**
 * @deprecated Use the generalized tag system with shortRepresentation instead.
 * Configure tier tags with stickerDisplay='short' and appropriate shortRepresentation values.
 *
 * Format tier value as display string with icons
 */
export const formatTierAsDisplay = (tierValue: string): string => {
  const tierDisplayMap = {
    Free: "🆓 Free",
    Paid: "💰 Paid",
    Premium: "💎 Premium",
  };

  return tierDisplayMap[tierValue as keyof typeof tierDisplayMap] || tierValue;
};

/**
 * @deprecated Use the generalized tag system with shortRepresentation instead.
 * Configure tier tags with stickerDisplay='short' and shortRepresentation='$', '$$', '$$$' etc.
 * The MediaTileTagStickers component will automatically display these.
 *
 * Format tier level as display string with icons
 */
export const formatTierLevelAsDisplay = (level: number): string => {
  const levelToValue = {
    0: "Free",
    1: "Paid",
    2: "Premium",
  };

  const tierValue = levelToValue[level as keyof typeof levelToValue];
  return tierValue ? formatTierAsDisplay(tierValue) : `Level ${level}`;
};

/**
 * @deprecated Use formatTierLevelAsDisplay instead
 * Format Content Quality level as tier display (e.g., "$$$" for level 2)
 */
export const formatContentQualityAsTier = (level: number): string => {
  return new Array(level + 1).fill("$").join("");
};
