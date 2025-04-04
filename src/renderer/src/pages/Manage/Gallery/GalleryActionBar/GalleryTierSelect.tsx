import { Button } from "@renderer/components/ui/button";
import { useTiers } from "@renderer/hooks/useTiers";
import { printTier } from "@renderer/lib/tier";
import { Media } from "src/features/library/entity";

type Props = {
  selectedMedia: Media[];
  onUpdate: () => void;
};

export const GalleryTierSelect = ({ selectedMedia, onUpdate }: Props) => {
  const { tiers, assignTierToMedias } = useTiers();

  const selectTier = async (tierId: number | null) => {
    await assignTierToMedias(
      selectedMedia.map((media) => media.id),
      tierId ?? -1
    );
    onUpdate();
  };

  const selectedTiers = selectedMedia.map((media) => media.tier?.id);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">Assign tier</div>
      <div className="flex flex-wrap gap-2">
        {tiers.map((tier) => (
          <Button
            key={tier.id}
            variant={selectedTiers.includes(tier.id) ? "outline" : "ghost"}
            size="sm"
            onClick={() => selectTier(tier.id)}
            className="min-w-[3rem] flex gap-2"
          >
            <span>{tier.name}</span>
            <span>{printTier(tier)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
