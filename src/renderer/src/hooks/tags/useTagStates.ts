import { groupBy } from "ramda";
import { useMemo } from "react";
import { Media } from "../../../../features/library/entity";
import { SelectionState } from "../../components/tags/types";
import { useTagsForMedias } from "../api/tags/useTags";

export type TagStates = Record<number, SelectionState>;

export type UseTagStatesResult = {
  tagStates: TagStates;
  isLoading: boolean;
  error: Error | null;
};

export const useTagStates = (selectedMedia: Media[]): UseTagStatesResult => {
  const mediaIds = selectedMedia.map((media) => media.id);
  const { data: allMediaTags, isLoading, error } = useTagsForMedias(mediaIds);

  const tagStates = useMemo(() => {
    if (isLoading || !allMediaTags) {
      return {};
    }

    if (selectedMedia.length === 0) {
      return {};
    }

    const tagGroups = groupBy((mediaTag) => mediaTag.tagDefinitionId.toString(), allMediaTags);

    const states: TagStates = {};
    Object.entries(tagGroups).forEach(([tagIdStr, mediaTags]) => {
      const tagId = parseInt(tagIdStr, 10);
      const uniqueMediaIds = new Set(mediaTags.map((mt) => mt.mediaId));

      if (uniqueMediaIds.size === 0) {
        // No media have this tag
        states[tagId] = "unchecked";
      } else if (uniqueMediaIds.size === selectedMedia.length) {
        // All selected media have this tag
        states[tagId] = "checked";
      } else {
        // Some but not all selected media have this tag
        states[tagId] = "indeterminate";
      }
    });

    return states;
  }, [allMediaTags, selectedMedia, isLoading]);

  return {
    tagStates,
    isLoading,
    error: error as Error | null,
  };
};
