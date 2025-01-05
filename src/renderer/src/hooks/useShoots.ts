import { useCallback, useEffect, useState } from "react";
import { PaginatedResponse } from "../../../features/_common/pagination";
import { GetAllShootsParams, ShootSummary } from "../../../features/shoots/api-type";

type CreateShootParams = {
  name: string;
  description?: string;
  shootDate: Date;
  mediaIds: string[];
};

type UseShoots = {
  shoots: ShootSummary[];
  totalItems: number;
  totalPages: number;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addMediaToShoot: (shootId: string, mediaIds: string[]) => Promise<void>;
  createShoot: (params: CreateShootParams) => Promise<void>;
};

export const useShoots = (params?: GetAllShootsParams): UseShoots => {
  const [shoots, setShoots] = useState<ShootSummary[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchShoots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<ShootSummary> = await window.api["shoot:getAll"](params);
      setShoots(response.items);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch shoots"));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchShoots();
  }, [fetchShoots]);

  const addMediaToShoot = useCallback(
    async (shootId: string, mediaIds: string[]) => {
      try {
        await window.api["shoot:update"](shootId, { mediaIds });
        await fetchShoots();
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to add media to shoot");
      }
    },
    [fetchShoots]
  );

  const createShoot = useCallback(
    async (params: CreateShootParams) => {
      try {
        await window.api["shoot:create"](params);
        await fetchShoots();
      } catch (err) {
        throw err instanceof Error ? err : new Error("Failed to create shoot");
      }
    },
    [fetchShoots]
  );

  return {
    shoots,
    totalItems,
    totalPages,
    loading,
    error,
    refetch: fetchShoots,
    addMediaToShoot,
    createShoot,
  };
};
