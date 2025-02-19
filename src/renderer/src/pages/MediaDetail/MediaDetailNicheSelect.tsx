import { NicheSelect, NicheSelectionState } from "@renderer/components/NicheSelect";
import { useNiches } from "@renderer/contexts/NicheContext";
import { useState } from "react";
import { Media } from "../../../../features/library/entity";

type MediaDetailNicheSelectProps = {
  media: Media;
};

export const MediaDetailNicheSelect = ({ media }: MediaDetailNicheSelectProps) => {
  const { niches } = useNiches();
  const [nicheStates, setNicheStates] = useState<NicheSelectionState[]>(
    media.niches?.map((n) => ({ id: n.id, state: "selected" as const })) ?? []
  );

  const updateNiches = async (
    newNicheStates: NicheSelectionState[] | undefined,
    _changedNicheId: number
  ) => {
    const selectedNicheIds = (newNicheStates ?? [])
      .filter((n) => n.state === "selected")
      .map((n) => n.id);

    await window.api["library:updateNiches"](media.id, selectedNicheIds);
    setNicheStates(
      selectedNicheIds.map((id) => ({
        id,
        state: "selected" as const,
      }))
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Niches</h3>
      <NicheSelect value={nicheStates} multiple onChange={updateNiches} size="lg" />
      {nicheStates.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {nicheStates
            .filter((n) => n.state === "selected")
            .map((n) => niches.find((niche) => niche.id === n.id)?.hashtags.join(" "))
            .filter(Boolean)
            .join(" ")}
        </div>
      )}
    </div>
  );
};
