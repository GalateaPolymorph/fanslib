import { useTags } from "@renderer/contexts/TagContext";
import { useState } from "react";
import { Media } from "../../../../features/library/entity";
import { TagSelect, TagSelectionState } from "../../components/TagSelect";

type MediaDetailTagSelectProps = {
  media: Media;
};

export const MediaDetailTagSelect = ({ media }: MediaDetailTagSelectProps) => {
  const { tags } = useTags();
  const [tagStates, setTagStates] = useState<TagSelectionState[]>(
    media.tags?.map((t) => ({ id: t.id, state: "selected" as const })) ?? []
  );

  const updateTags = async (
    newTagStates: TagSelectionState[] | undefined,
    _changedTagId: number
  ) => {
    const selectedTagIds = (newTagStates ?? [])
      .filter((t) => t.state === "selected")
      .map((t) => t.id);

    await window.api["library:updateTags"](media.id, selectedTagIds);
    setTagStates(
      selectedTagIds.map((id) => ({
        id,
        state: "selected" as const,
      }))
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-medium">Tags</h3>
      <TagSelect value={tagStates} multiple onChange={updateTags} size="lg" />
      {tagStates.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {tagStates
            .filter((t) => t.state === "selected")
            .map((t) => tags.find((tag) => tag.id === t.id)?.hashtags.join(" "))
            .filter(Boolean)
            .join(" ")}
        </div>
      )}
    </div>
  );
};
