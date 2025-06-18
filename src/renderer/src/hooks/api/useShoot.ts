import { useQuery } from "@tanstack/react-query";
import { ShootSummary } from "../../../../features/shoots/api-type";

export const shootKeys = {
  all: ["shoots"] as const,
  byIds: (ids: string[]) => ["shoots", "by-ids", ids] as const,
};

export const useShootsByIds = (shootIds: string[]) => {
  return useQuery({
    queryKey: shootKeys.byIds(shootIds),
    queryFn: async (): Promise<ShootSummary[]> => {
      if (shootIds.length === 0) return [];

      // Fetch shoots individually since there's no bulk fetch API
      const shootPromises = shootIds.map(async (id) => {
        try {
          const shoot = await window.api["shoot:get"](id);
          return shoot ? ({ id: shoot.id, name: shoot.name } as ShootSummary) : null;
        } catch {
          return null;
        }
      });

      const shoots = await Promise.all(shootPromises);
      return shoots.filter((shoot): shoot is ShootSummary => shoot !== null);
    },
    enabled: shootIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
