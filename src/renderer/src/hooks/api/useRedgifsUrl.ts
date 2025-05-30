import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Media } from "../../../../features/library/entity";

type RedgifsLookupResult = {
  lookupRedgifsUrl: (media: Media | null) => Promise<string | null>;
};

export const useRedgifsLookup = (): RedgifsLookupResult => {
  const lookupRedgifsUrl = useCallback(async (media: Media | null): Promise<string | null> => {
    if (!media || media.type !== "video") {
      return null;
    }

    try {
      const response = await window.api["api-postpone:findRedgifsURL"]({
        mediaId: media.id,
      });
      return response?.url || null;
    } catch (err) {
      // If the API call fails, return null URL instead of throwing
      console.warn("Failed to fetch RedGIFs URL:", err);
      return null;
    }
  }, []);

  return {
    lookupRedgifsUrl,
  };
};

// Keep the original hook for backward compatibility during migration
type RedgifsUrlResult = {
  url: string | null;
  isLoading: boolean;
  error: Error | null;
};

export const useRedgifsUrl = (media: Media | null): RedgifsUrlResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["redgifs-url", media?.id],
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
    staleTime: 10 * 60 * 1000, // 10 minutes - RedGIFs URLs don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 1, // Only retry once for RedGIFs lookup
  });

  return {
    url: data?.url || null,
    isLoading,
    error: error as Error | null,
  };
};
