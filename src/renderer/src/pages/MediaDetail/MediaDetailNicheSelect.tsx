import { NicheSelect, NicheSelectionState } from "@renderer/components/NicheSelect";
import { useNiches } from "@renderer/hooks";
import { useState } from "react";
import { Media } from "../../../../features/library/entity";

type MediaDetailNicheSelectProps = {
  media: Media;
};

export const MediaDetailNicheSelect = ({ media }: MediaDetailNicheSelectProps) => {
  const { data: niches = [], isLoading } = useNiches();
  const [nicheStates, setNicheStates] = useState<NicheSelectionState[]>(
    () => media.niches?.map((niche) => ({ id: niche.id, state: "selected" as const })) ?? []
  );

  const updateNiches = async (
    newNicheStates: NicheSelectionState[] | undefined,
    _changedNicheId: number
  ) => {
    const selectedNicheIds = (newNicheStates ?? [])
      .filter((n) => n.state === "selected")
      .map((n) => n.id);

    try {
      await window.api["library:updateNiches"](media.id, selectedNicheIds);
      setNicheStates(
        selectedNicheIds.map((id) => ({
          id,
          state: "selected" as const,
        }))
      );
    } catch (error) {
      console.error("Failed to update niches:", error);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading niches...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Niches</h3>
      <NicheSelect value={nicheStates} onChange={updateNiches} multiple size="lg" />
      {nicheStates.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {nicheStates
            .filter((n) => n.state === "selected")
            .map((n) =>
              niches
                .find((niche) => niche.id === n.id)
                ?.hashtags.map((h) => `${h.name}`)
                .join(" ")
            )
            .filter(Boolean)
            .join(" ")}
        </div>
      )}
    </div>
  );
};
