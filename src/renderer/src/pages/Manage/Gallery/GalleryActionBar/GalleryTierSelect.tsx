import { Button } from "@renderer/components/ui/button";
import { useAssignTierToMedias, useTiers } from "@renderer/hooks";
import { printTier } from "@renderer/lib/tier";
import { Media } from "src/features/library/entity";

type Props = {
  selectedMedia: Media[];
  onUpdate: () => void;
};

export const GalleryTierSelect = ({ selectedMedia, onUpdate }: Props) => {
  const { data: tiers = [] } = useTiers();
  const assignTierToMediasMutation = useAssignTierToMedias();

  const selectTier = async (tierId: number | null) => {
    try {
      await assignTierToMediasMutation.mutateAsync({
        mediaIds: selectedMedia.map((media) => media.id),
        tierId: tierId ?? -1,
      });
      onUpdate();
    } catch (error) {
      // Error is handled by the mutation
      console.error("Failed to assign tier:", error);
    }
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
            disabled={assignTierToMediasMutation.isPending}
          >
            <span>{tier.name}</span>
            <span>{printTier(tier)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
