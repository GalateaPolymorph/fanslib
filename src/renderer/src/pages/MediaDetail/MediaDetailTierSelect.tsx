import { useAssignTierToMedia, useTiers } from "@renderer/hooks";
import { useState } from "react";
import { Media } from "src/features/library/entity";
import { TierBadge } from "../../components/TierBadge";

type Props = {
  media: Media;
};

export const MediaDetailTierSelect = ({ media }: Props) => {
  const [tierId, setTierId] = useState<number | null>(media.tier?.id ?? null);
  const { data: tiers = [] } = useTiers();
  const assignTierToMediaMutation = useAssignTierToMedia();

  const selectTier = async (tierId: number | null) => {
    if (assignTierToMediaMutation.isPending) return;

    setTierId(tierId);
    try {
      await assignTierToMediaMutation.mutateAsync({
        mediaId: media.id,
        tierId: tierId ?? -1,
      });
    } catch (error) {
      // Error is handled by the mutation, revert optimistic update
      setTierId(media.tier?.id ?? null);
      console.error("Failed to assign tier:", error);
    }
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
