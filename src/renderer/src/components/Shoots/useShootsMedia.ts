import { useMemo } from "react";
import { Media } from "../../../../features/library/entity";
import { ShootWithMedia } from "../../../../features/shoots/api-type";
import { useShootPreferences } from "../../contexts/ShootPreferencesContext";

type GroupKey = {
  shootId: string;
  viewIndex: string;
};

export type GroupedShootMedia = {
  allMedia: Map<GroupKey, Media[]>;
  shootsMedia: Map<GroupKey, Map<string, Media[]>>;
};

const sortMediaByDate = (a: Media, b: Media) =>
  b.fileCreationDate.getTime() - a.fileCreationDate.getTime();

export const useShootsMedia = (shoots: ShootWithMedia[]): GroupedShootMedia => {
  const { preferences: shootPreferences } = useShootPreferences();

  return useMemo(() => {
    const shootsMedia = new Map<GroupKey, Map<string, Media[]>>();
    const allMedia = new Map<GroupKey, Media[]>();

    // Sort shoots by shootDate (descending) to match the view
    const sortedShoots = [...shoots].sort(
      (a, b) => new Date(b.shootDate).getTime() - new Date(a.shootDate).getTime()
    );

    sortedShoots.forEach((shoot, viewIndex) => {
      if (!shoot.media) return;

      // Create group key with both shoot ID and view index
      const groupKey = {
        shootId: shoot.id,
        viewIndex: viewIndex.toString().padStart(5, "0"),
      };

      // Add all media to the shoot-grouped map
      const sortedMedia = [...shoot.media].sort(sortMediaByDate);
      allMedia.set(groupKey, sortedMedia);

      // Group media for this shoot
      const grouped = new Map<string, Media[]>();
      const uncategorized: Media[] = [];

      shoot.media.forEach((media) => {
        if (media.categories.length === 0) {
          uncategorized.push(media);
        } else {
          // Sort categories to ensure stable ordering
          const sortedCategories = [...media.categories].sort((a, b) => a.id.localeCompare(b.id));
          sortedCategories.forEach((category) => {
            const existing = grouped.get(category.id) || [];
            grouped.set(category.id, [...existing, media]);
          });
        }
      });

      // Sort media within each category by fileCreationDate
      grouped.forEach((mediaList, categoryId) => {
        grouped.set(categoryId, [...mediaList].sort(sortMediaByDate));
      });

      // Add uncategorized at the end if there are any
      if (uncategorized.length > 0) {
        grouped.set("uncategorized", [...uncategorized].sort(sortMediaByDate));
      }

      // If not grouping by category, create a single "ALL" group
      if (!shootPreferences.groupByCategory) {
        const sortedMap = new Map<string, Media[]>();
        sortedMap.set("ALL", sortedMedia);
        shootsMedia.set(groupKey, sortedMap);
      } else {
        // Sort category IDs to ensure stable ordering
        const sortedGrouped = new Map(
          [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))
        );
        shootsMedia.set(groupKey, sortedGrouped);
      }
    });

    return { allMedia, shootsMedia };
  }, [shoots, shootPreferences.groupByCategory]);
};
