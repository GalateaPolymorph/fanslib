import { useTiers } from "../hooks/useTiers";
import { TierBadge } from "./TierBadge";
import { Button } from "./ui/button";

type TierSelectProps = {
  selectedTierIds: number[] | undefined;
  onTierSelect: (tierIds: number[] | undefined) => void;
  label?: string;
  includeNoneOption?: boolean;
  multiple?: boolean;
};

export const TierSelect = ({
  selectedTierIds,
  onTierSelect,
  includeNoneOption = false,
  multiple = false,
}: TierSelectProps) => {
  const { tiers } = useTiers();

  const toggleTier = (tierId: number) => {
    if (multiple) {
      if (selectedTierIds.includes(tierId)) {
        onTierSelect(selectedTierIds.filter((id) => id !== tierId));
      } else {
        onTierSelect([...selectedTierIds, tierId]);
      }
    } else {
      onTierSelect(selectedTierIds[0] === tierId ? [] : [tierId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {includeNoneOption && (
        <Button
          variant={selectedTierIds && selectedTierIds.length === 0 ? "default" : "ghost"}
          size="sm"
          className="min-w-[3rem] border border-transparent flex gap-2"
          onClick={() => onTierSelect([])}
        >
          None
        </Button>
      )}
      {tiers.map((tier) => (
        <TierBadge
          key={tier.id}
          tier={tier}
          isSelected={selectedTierIds.includes(tier.id)}
          onClick={() => toggleTier(tier.id)}
        />
      ))}
    </div>
  );
};
