import { MediaFilters } from "../../../../features/library/api-type";
import { Media } from "../../../../features/library/entity";

export const selectRandomMedia = async (
  filters?: MediaFilters
): Promise<{
  media: Media | null;
  totalAvailable: number;
}> => {
  try {
    // Use empty filters if none provided (this will select from all media)
    const mediaFilters = filters || [];

    // First, get the total count of available media with the filters
    const countResponse = await window.api["library:getAll"]({
      filters: mediaFilters,
      page: 1,
      limit: 1, // We only need the count, not the actual items
    });

    if (countResponse.total === 0) {
      return {
        media: null,
        totalAvailable: 0,
      };
    }

    // Generate a random page number based on total items
    // We'll use a larger page size to get more items to choose from
    const pageSize = Math.min(50, countResponse.total);
    const totalPages = Math.ceil(countResponse.total / pageSize);
    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    // Fetch a random page of media
    const mediaResponse = await window.api["library:getAll"]({
      filters: mediaFilters,
      page: randomPage,
      limit: pageSize,
      sort: { field: "random", direction: "ASC" }, // Use random sort if available
    });

    if (mediaResponse.items.length === 0) {
      return {
        media: null,
        totalAvailable: countResponse.total,
      };
    }

    // Select a random item from the fetched page
    const randomIndex = Math.floor(Math.random() * mediaResponse.items.length);
    const randomMedia = mediaResponse.items[randomIndex];

    return {
      media: randomMedia,
      totalAvailable: countResponse.total,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Failed to fetch random media");
    throw error;
  }
};
