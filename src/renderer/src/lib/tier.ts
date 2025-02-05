import { Post } from "src/features/posts/entity";
import { Tier } from "src/features/tiers/entity";
import { VirtualPost } from "./virtual-posts";

export const printTier = (tier: Tier) => {
  return new Array(tier.level + 1).fill("$").join("");
};

export const maximumTier = (post: Post | VirtualPost) => {
  const tierLevel = post.postMedia.reduce((max, postMedia) => {
    return Math.max(max, postMedia.media.tier?.level || 0);
  }, 0);
  return post.postMedia.find((postMedia) => postMedia.media.tier?.level === tierLevel)?.media.tier;
};
