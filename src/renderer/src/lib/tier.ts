import { Post } from "src/features/posts/entity";
import { Tier } from "src/features/tiers/entity";
import { VirtualPost } from "./virtual-posts";

/**
 * @deprecated Use the generalized tag system with shortRepresentation instead.
 * Configure tier tags with stickerDisplay='short' and shortRepresentation values like '$', '$$', '$$$'.
 * The MediaTileTagStickers component will automatically display these without needing this function.
 *
 * For migration: Replace printTier(tier) calls with tag.shortRepresentation from MediaTag entities.
 */
export const printTier = (tier: Tier) => {
  return new Array(tier.level + 1).fill("$").join("");
};

export const maximumTier = (post: Post | VirtualPost) => {
  const tierLevel = post.postMedia.reduce((max, postMedia) => {
    return Math.max(max, postMedia.media.tier?.level || 0);
  }, 0);
  return post.postMedia.find((postMedia) => postMedia.media.tier?.level === tierLevel)?.media.tier;
};
