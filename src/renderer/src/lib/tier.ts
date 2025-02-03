import { Tier } from "src/features/tiers/entity";

export const printTier = (tier: Tier) => {
  return new Array(tier.level + 1).fill("$").join("");
};
