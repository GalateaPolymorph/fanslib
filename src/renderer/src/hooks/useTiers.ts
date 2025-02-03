import { useCallback, useEffect, useState } from "react";
import { Tier } from "src/features/tiers/entity";

export const useTiers = () => {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTiers = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedTiers = await window.api["tier:getAll"]();
      setTiers(loadedTiers);
    } catch (error) {
      console.error("Error loading tiers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTiers();
  }, [loadTiers]);

  const assignTierToMedia = useCallback(async (mediaId: string, tierId: number) => {
    try {
      await window.api["library:assignTierToMedia"](mediaId, tierId);
      return true;
    } catch (error) {
      console.error("Error assigning tier to media:", error);
      return false;
    }
  }, []);
  const assignTierToMedias = async (mediaIds: string[], tierId: number) => {
    try {
      await window.api["library:assignTierToMedias"](mediaIds, tierId);
      return true;
    } catch (error) {
      console.error("Failed to assign tier to medias:", error);
      return false;
    }
  };

  return {
    tiers,
    isLoading,
    loadTiers,
    assignTierToMedia,
    assignTierToMedias,
  };
};
