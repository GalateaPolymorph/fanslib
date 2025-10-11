import { useMemo } from "react";
import { Channel } from "../../../../features/channels/entity";
import { Subreddit } from "../../../../features/channels/subreddit";
import { MediaFilters } from "../../../../features/library/api-type";
import { isLegacyFilter, sanitizeFilterInput } from "../../../../features/library/filter-helpers";
import { ShootSummary } from "../../../../features/shoots/api-type";
import { TagDefinition } from "../../../../features/tags/entity";
import { useTagDefinitionsByIds } from "../api/tags/useTagDefinitions";
import { useChannels, useSubreddits } from "../api/useChannels";
import { useShootsByIds } from "../api/useShoot";

const getEntityIdsFromMediaFilters = (mediaFilters: MediaFilters | null) => {
  if (!mediaFilters || mediaFilters.length === 0 || isLegacyFilter(mediaFilters)) {
    return { tagIds: [], channelIds: [], subredditIds: [], shootIds: [] };
  }

  const tagIds: number[] = [];
  const channelIds: string[] = [];
  const subredditIds: string[] = [];
  const shootIds: string[] = [];

  mediaFilters.forEach((group) => {
    group.items.forEach((item) => {
      switch (item.type) {
        case "tag": {
          const tagId = parseInt(item.id);
          if (!isNaN(tagId)) {
            tagIds.push(tagId);
          }
          break;
        }
        case "channel": {
          channelIds.push(item.id);
          break;
        }
        case "subreddit": {
          subredditIds.push(item.id);
          break;
        }
        case "shoot": {
          shootIds.push(item.id);
          break;
        }
      }
    });
  });

  return {
    tagIds: Array.from(new Set(tagIds)),
    channelIds: Array.from(new Set(channelIds)),
    subredditIds: Array.from(new Set(subredditIds)),
    shootIds: Array.from(new Set(shootIds)),
  };
};

export type FilterSummaryItem = {
  type: "content" | "location" | "media" | "date" | "tags";
  label: string;
  count: number;
  include: boolean;
  tooltip: string;
  details?: string[];
};

const createFilterSummary = (
  filters: MediaFilters,
  channels: Channel[] = [],
  subreddits: Subreddit[] = [],
  shoots: ShootSummary[] = [],
  tagDefinitions: TagDefinition[] = []
): FilterSummaryItem[] => {
  const summary: Map<string, FilterSummaryItem> = new Map();

  // Create lookup maps for efficient entity name resolution
  const channelMap = new Map(channels.map((c) => [c.id, c.name]));
  const subredditMap = new Map(subreddits.map((s) => [s.id, s.name]));
  const shootMap = new Map(shoots.map((s) => [s.id, s.name]));
  const tagMap = new Map(tagDefinitions.map((t) => [t.id.toString(), t.displayName]));

  // Debug logging for tag resolution
  console.log("Tag definitions received:", tagDefinitions);
  console.log("Tag map created:", tagMap);

  filters.forEach((group) => {
    group.items.forEach((item) => {
      let key: string | null = null;
      let type: FilterSummaryItem["type"];
      let label: string;
      let tooltip: string;
      let entityName: string | undefined;

      if (item.type === "channel") {
        key = `${group.include ? "inc" : "exc"}-channels`;
        type = "location";
        label = group.include ? "Channels" : "Excluded channels";
        entityName = channelMap.get(item.id);
        tooltip = `${group.include ? "Include" : "Exclude"} channel: ${entityName || item.id}`;
      } else if (item.type === "subreddit") {
        key = `${group.include ? "inc" : "exc"}-subreddits`;
        type = "location";
        label = group.include ? "Subreddits" : "Excluded subreddits";
        entityName = subredditMap.get(item.id);
        tooltip = `${group.include ? "Include" : "Exclude"} subreddit: r/${entityName || item.id}`;
      } else if (item.type === "shoot") {
        key = `${group.include ? "inc" : "exc"}-shoots`;
        type = "content";
        label = group.include ? "Shoots" : "Excluded shoots";
        entityName = shootMap.get(item.id);
        tooltip = `${group.include ? "Include" : "Exclude"} shoot: ${entityName || item.id}`;
      } else if (item.type === "tag") {
        key = `${group.include ? "inc" : "exc"}-tags`;
        type = "tags";
        label = group.include ? "Tags" : "Excluded tags";
        entityName = tagMap.get(item.id);
        tooltip = `${group.include ? "Include" : "Exclude"} tag: ${entityName || item.id}`;
      } else if (item.type === "filename") {
        key = `${group.include ? "inc" : "exc"}-filenames`;
        type = "content";
        label = group.include ? "Filename" : "Excluded filename";
        tooltip = `${group.include ? "Include" : "Exclude"} files matching: "${item.value}"`;
      } else if (item.type === "caption") {
        key = `${group.include ? "inc" : "exc"}-captions`;
        type = "content";
        label = group.include ? "Caption" : "Excluded caption";
        tooltip = `${group.include ? "Include" : "Exclude"} posts with caption: "${item.value}"`;
      } else if (item.type === "posted") {
        key = item.value ? "posted" : "unposted";
        type = "content";
        label = item.value ? "Posted" : "Unposted";
        tooltip = `Only ${item.value ? "posted" : "unposted"} content`;
      } else if (item.type === "mediaType") {
        key = `media-${item.value}`;
        type = "media";
        label = item.value === "image" ? "Images" : "Videos";
        tooltip = `Only ${item.value === "image" ? "image" : "video"} files`;
      } else if (item.type === "createdDateStart") {
        key = `${group.include ? "inc" : "exc"}-dates`;
        type = "date";
        label = "Date range";
        tooltip = `Created after ${item.value.toLocaleDateString()}`;
      } else if (item.type === "createdDateEnd") {
        key = `${group.include ? "inc" : "exc"}-dates`;
        type = "date";
        label = "Date range";
        tooltip = `Created before ${item.value.toLocaleDateString()}`;
      } else if (item.type === "dimensionEmpty") {
        key = `${group.include ? "inc" : "exc"}-dimension-empty`;
        type = "tags";
        label = "Missing tags";
        tooltip = `${group.include ? "Include" : "Exclude"} media missing tags from dimension ${item.dimensionId}`;
      } else {
        return;
      }

      if (key) {
        const existing = summary.get(key);
        if (existing) {
          existing.count += 1;
          // Add entity name to details array for multi-item summaries
          if (entityName && !existing.details?.includes(entityName)) {
            existing.details = existing.details || [];
            existing.details.push(entityName);

            // Update tooltip to show all entities
            if (existing.details.length > 1) {
              existing.tooltip = `${group.include ? "Include" : "Exclude"}: ${existing.details.slice(0, 3).join(", ")}${existing.details.length > 3 ? ` and ${existing.details.length - 3} more` : ""}`;
            }
          }
        } else {
          summary.set(key, {
            type,
            label,
            count: 1,
            include: group.include,
            tooltip,
            details: entityName ? [entityName] : undefined,
          });
        }
      }
    });
  });

  return Array.from(summary.values());
};

export const useMediaFilterSummary = (mediaFilters: MediaFilters | null): FilterSummaryItem[] => {
  const filters = useMemo(() => sanitizeFilterInput(mediaFilters), [mediaFilters]);

  const entityIds = useMemo(() => getEntityIdsFromMediaFilters(filters), [filters]);

  // Fetch all required entities
  const { data: channels = [] } = useChannels();
  const { data: subreddits = [] } = useSubreddits();
  const { data: tagDefinitions = [] } = useTagDefinitionsByIds(entityIds.tagIds);
  const { data: shoots = [] } = useShootsByIds(entityIds.shootIds);

  return useMemo(() => {
    if (!filters || filters.length === 0) {
      return [];
    }

    return createFilterSummary(filters, channels, subreddits, shoots, tagDefinitions);
  }, [filters, channels, subreddits, shoots, tagDefinitions]);
};
