import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Media } from "../../../../features/library/entity";

// Keep the original hook for backward compatibility during migration
type RedgifsUrlResult = {
  url: string | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<unknown>;
};

export const useRedgifsUrl = (media: Media | null): RedgifsUrlResult => {
  const queryKey = useMemo(() => ["redgifs-url", media?.id], [media?.id]);

  const {
    data,
    isFetching,
    error,
    refetch: refresh,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!media || media.type !== "video") {
        return { url: null };
      }

      try {
        const response = await window.api["api-postpone:findRedgifsURL"]({
          mediaId: media.id,
        });
        return response;
      } catch (err) {
        // If the API call fails, return null URL instead of throwing
        console.warn("Failed to fetch RedGIFs URL:", err);
        return { url: null };
      }
    },
    enabled: !!media && media.type === "video",
  });

  return {
    url: data?.url || null,
    isLoading: isFetching,
    error: error as Error | null,
    refresh,
  };
};
