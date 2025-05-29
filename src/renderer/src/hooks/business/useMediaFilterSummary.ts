import { useMemo } from "react";
import { MediaFilters } from "../../../../features/library/api-type";
import { TagDefinition } from "../../../../features/tags/entity";
import { useTagDefinitionsByIds } from "../api/tags/useTagDefinitions";

const getTagIdsFromMediaFilters = (mediaFilters: MediaFilters | null): number[] => {
  if (!mediaFilters?.tagFilters) {
    return [];
  }

  const tagIds: number[] = [];
  Object.values(mediaFilters.tagFilters).forEach((tagFilter) => {
    if (tagFilter.tagIds?.length) {
      tagIds.push(...tagFilter.tagIds);
    }
  });

  return [...new Set(tagIds)];
};

export type FilterSummaryItem = {
  type: "tag" | "search" | "channel" | "shoot" | "excludeShoot";
  label: string;
  value?: string;
  count?: number;
  tags?: TagDefinition[];
  dimensionName?: string;
  isNoneFilter?: boolean;
};

export const useMediaFilterSummary = (mediaFilters: MediaFilters | null): FilterSummaryItem[] => {
  const tagIds = useMemo(() => getTagIdsFromMediaFilters(mediaFilters), [mediaFilters]);
  const { data: tagDefinitions } = useTagDefinitionsByIds(tagIds);

  return useMemo(() => {
    if (!mediaFilters || Object.keys(mediaFilters).length === 0) {
      return [];
    }

    const filterItems: FilterSummaryItem[] = [];

    // Tag filters
    if (mediaFilters.tagFilters && Object.keys(mediaFilters.tagFilters).length > 0) {
      Object.entries(mediaFilters.tagFilters).forEach(([dimensionName, tagFilter]) => {
        if (tagFilter.tagIds?.length) {
          const tags = tagDefinitions?.filter((tag) => tagFilter.tagIds?.includes(tag.id)) || [];
          filterItems.push({
            type: "tag",
            label: dimensionName,
            dimensionName,
            tags,
            count: tagFilter.tagIds.length,
          });
        } else if (tagFilter.tagIds?.length === 0) {
          // Empty array means "none" filter
          filterItems.push({
            type: "tag",
            label: dimensionName,
            dimensionName,
            isNoneFilter: true,
          });
        }
      });
    }

    // Search filter
    if (mediaFilters.search) {
      filterItems.push({
        type: "search",
        label: "Search",
        value: mediaFilters.search,
      });
    }

    // Channel filters
    if (mediaFilters.channelFilters?.length) {
      filterItems.push({
        type: "channel",
        label: "Channels",
        count: mediaFilters.channelFilters.length,
      });
    }

    // Shoot filter
    if (mediaFilters.shootId) {
      filterItems.push({
        type: "shoot",
        label: "Specific Shoot",
      });
    }

    // Exclude shoots filter
    if (mediaFilters.excludeShoots?.length) {
      filterItems.push({
        type: "excludeShoot",
        label: "Exclude Shoots",
        count: mediaFilters.excludeShoots.length,
      });
    }

    return filterItems;
  }, [mediaFilters, tagDefinitions]);
};
