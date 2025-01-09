import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PaginatedResponse } from "../../../features/_common/pagination";
import { GetAllShootsParams, ShootFilter, ShootSummary } from "../../../features/shoots/api-type";

type CreateShootParams = {
  name: string;
  description?: string;
  shootDate: Date;
  mediaIds: string[];
};

type ShootContextType = {
  shoots: ShootSummary[];
  totalItems: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  filter: ShootFilter;
  updateFilter: (filter: Partial<ShootFilter>) => void;
  clearFilter: () => void;
  refetch: () => Promise<void>;
  addMediaToShoot: (shootId: string, mediaIds: string[]) => Promise<void>;
  createShoot: (params: CreateShootParams) => Promise<void>;
};

const ShootContext = createContext<ShootContextType | null>(null);

export const useShootContext = () => {
  const context = useContext(ShootContext);
  if (!context) {
    throw new Error("useShootContext must be used within a ShootProvider");
  }
  return context;
};

type ShootProviderProps = {
  children: React.ReactNode;
  params?: Omit<GetAllShootsParams, "filter">;
};

export const ShootProvider = ({ children, params }: ShootProviderProps) => {
  const [paginatedShoots, setPaginatedShoots] = useState<PaginatedResponse<ShootSummary>>({
    items: [],
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 50,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<ShootFilter>({});

  const updateFilter = useCallback((newFilter: Partial<ShootFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const clearFilter = useCallback(() => {
    setFilter({});
  }, []);

  const fetchShoots = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await window.api["shoot:getAll"]({
        ...params,
        filter,
      });
      setPaginatedShoots(response);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch shoots"));
    } finally {
      setIsLoading(false);
    }
  }, [params, filter]);

  useEffect(() => {
    if ((!filter.startDate && !filter.endDate) || (filter.startDate && filter.endDate)) {
      void fetchShoots();
    }
  }, [fetchShoots, filter]);

  const addMediaToShoot = useCallback(
    async (shootId: string, mediaIds: string[]) => {
      try {
        await window.api["shoot:addMedia"]({ shootId, mediaIds });
        await fetchShoots();
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to add media to shoot"));
        throw err;
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
        setError(err instanceof Error ? err : new Error("Failed to create shoot"));
        throw err;
      }
    },
    [fetchShoots]
  );

  const value = {
    shoots: paginatedShoots.items,
    totalItems: paginatedShoots.total,
    totalPages: paginatedShoots.totalPages,
    isLoading,
    error,
    filter,
    updateFilter,
    clearFilter,
    refetch: fetchShoots,
    addMediaToShoot,
    createShoot,
  };

  return <ShootContext.Provider value={value}>{children}</ShootContext.Provider>;
};
