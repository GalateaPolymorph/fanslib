import { useMemo } from "react";
import { MediaFilters } from "../../../../features/library/api-type";
import {
  filterGroupToString,
  isLegacyFilter,
  sanitizeFilterInput,
} from "../../../../features/library/filter-helpers";
import { useTagDefinitionsByIds } from "../api/tags/useTagDefinitions";

const getTagIdsFromMediaFilters = (mediaFilters: MediaFilters | null): number[] => {
  if (!mediaFilters || mediaFilters.length === 0 || isLegacyFilter(mediaFilters)) {
    return [];
  }

  const tagIds: number[] = [];
  mediaFilters.forEach((group) => {
    group.items.forEach((item) => {
      if (item.type === "tag") {
        const tagId = parseInt(item.id);
        if (!isNaN(tagId)) {
          tagIds.push(tagId);
        }
      }
    });
  });

  return [...new Set(tagIds)];
};

export type FilterSummaryItem = {
  type: "filterGroup";
  label: string;
  include: boolean;
  itemCount: number;
  description: string;
};

export const useMediaFilterSummary = (mediaFilters: MediaFilters | null): FilterSummaryItem[] => {
  const filters = useMemo(() => sanitizeFilterInput(mediaFilters), [mediaFilters]);
  const tagIds = useMemo(() => getTagIdsFromMediaFilters(filters), [filters]);
  const { data: tagDefinitions } = useTagDefinitionsByIds(tagIds);

  return useMemo(() => {
    if (!filters || filters.length === 0) {
      return [];
    }

    return filters
      .filter((group) => group.items.length > 0)
      .map((group, index) => ({
        type: "filterGroup" as const,
        label: `Filter Group ${index + 1}`,
        include: group.include,
        itemCount: group.items.length,
        description: filterGroupToString(group),
      }));
  }, [filters, tagDefinitions]);
};
