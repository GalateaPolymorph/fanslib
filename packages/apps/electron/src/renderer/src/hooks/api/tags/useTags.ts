import { useQuery } from "@tanstack/react-query";
import { MediaTag } from "../../../../../features/tags/entity";

export const tagQueryKeys = {
  tagsForMedia: (mediaId: string, dimensionId?: number) => ["media-tags", mediaId, dimensionId],
  tagsForMedias: (mediaIds: string[], dimensionId?: number) => [
    "bulk-media-tags",
    mediaIds,
    dimensionId,
  ],
};

export const useTagsForMedia = (mediaId: string, dimensionId?: number) => {
  return useQuery<MediaTag[]>({
    queryKey: tagQueryKeys.tagsForMedia(mediaId, dimensionId),
    queryFn: async () => {
      return window.api["tags:getMediaTags"](mediaId, dimensionId);
    },
    enabled: !!mediaId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

export const useTagsForMedias = (mediaIds: string[], dimensionId?: number) => {
  return useQuery<MediaTag[]>({
    queryKey: tagQueryKeys.tagsForMedias(mediaIds, dimensionId),
    queryFn: async () => {
      if (mediaIds.length === 0) return [];

      // Fetch tags for all media items
      const tagPromises = mediaIds.map((mediaId) => window.api["tags:getMediaTags"](mediaId));

      const results = await Promise.all(tagPromises);
      return results.flat();
    },
    enabled: mediaIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
