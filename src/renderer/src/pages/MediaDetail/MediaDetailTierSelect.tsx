import { useState } from "react";
import { Media } from "src/features/library/entity";
import { TierBadge } from "../../components/TierBadge";
import { useTiers } from "../../hooks/useTiers";

type Props = {
  media: Media;
};

export const MediaDetailTierSelect = ({ media }: Props) => {
  const [tierId, setTierId] = useState<number | null>(media.tier?.id ?? null);
  const { tiers, assignTierToMedia } = useTiers();

  const selectTier = async (tierId: number | null) => {
    setTierId(tierId);
    assignTierToMedia(media.id, tierId ?? -1);
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Tier</h3>
      <div className="flex flex-wrap gap-2">
        {tiers.map((tier) => (
          <TierBadge
            key={tier.id}
            tier={tier}
            isSelected={tierId === tier.id}
            onClick={() => selectTier(tier.id)}
          />
        ))}
      </div>
    </div>
  );
};
