import { Tier } from "../../../features/tiers/entity";
import { printTier } from "../lib/tier";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

type TierBadgeProps = {
  tier: Tier;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
};

export const TierBadge = ({
  tier,
  isSelected = false,
  onClick,
  className,
  size = "sm",
}: TierBadgeProps) => {
  return (
    <Button
      variant={isSelected ? "outline" : "ghost"}
      size={size}
      className={cn(
        "min-w-[3rem] border border-transparent inline-flex gap-2",
        isSelected && "text-primary border-primary",
        className
      )}
      onClick={onClick}
    >
      <span>{tier.name}</span>
      <span>{printTier(tier)}</span>
    </Button>
  );
};
