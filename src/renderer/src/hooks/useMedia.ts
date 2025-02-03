import { useCallback, useEffect, useState } from "react";
import { Media } from "../../../features/library/entity";

export const useMedia = (id: string | undefined) => {
  const [media, setMedia] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    window.api["library:get"](id)
      .then((result) => {
        setMedia(result);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setMedia(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!id) {
      setMedia(null);
      setIsLoading(false);
      return;
    }
    fetchMedia();
  }, [fetchMedia, id]);

  return { media, isLoading, error, refetch: fetchMedia };
};
