import { NicheSelect, NicheSelectionState } from "@renderer/components/NicheSelect";
import { Media } from "../../../../../../features/library/entity";
import { getSelectionStates, updateSelectionForMedia } from "../../../../lib/selection-utils";

type GalleryNicheSelectProps = {
  selectedMedia: Media[];
  onUpdate: () => void;
};

export const GalleryNicheSelect = ({ selectedMedia, onUpdate }: GalleryNicheSelectProps) => {
  const getNicheStates = (): NicheSelectionState[] => {
    const states = getSelectionStates<Media, number>(selectedMedia, selectedMedia, (media) =>
      media.niches.map((niche) => niche.id)
    );
    return states;
  };

  const handleNicheChange = async (
    nicheStates: NicheSelectionState[] | undefined,
    changedNicheId: number
  ) => {
    if (!nicheStates || selectedMedia.length === 0 || changedNicheId === -1) return;

    await updateSelectionForMedia(
      selectedMedia,
      changedNicheId,
      (mediaId, nicheIds) => window.api["library:updateNiches"](mediaId, nicheIds as number[]),
      (media) => media.niches.map((niche) => niche.id)
    );

    onUpdate();
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground">Assign tags</div>
      <NicheSelect value={getNicheStates()} onChange={handleNicheChange} multiple={true} />
    </div>
  );
};
