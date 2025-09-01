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

      // If URL is already cached in media, return it
      if (media.redgifsUrl) {
        return { url: media.redgifsUrl };
      }

      try {
        const response = await window.api["api-postpone:findRedgifsURL"]({
          mediaId: media.id,
        });
        
        // If we got a URL, save it to the media record for future use
        if (response?.url) {
          try {
            await window.api["library:update"](media.id, {
              redgifsUrl: response.url,
            });
            console.log(`✅ Saved RedGifs URL for media ${media.id}`);
          } catch (updateError) {
            console.warn(`Failed to save RedGifs URL for media ${media.id}:`, updateError);
          }
        }
        
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
