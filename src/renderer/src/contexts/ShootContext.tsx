import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { PaginatedResponse } from "../../../features/_common/pagination";
import { GetAllShootsParams, ShootSummary } from "../../../features/shoots/api-type";

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
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  clearDateFilters: () => void;
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
  params?: GetAllShootsParams;
};

export const ShootProvider = ({ children, params }: ShootProviderProps) => {
  const [shoots, setShoots] = useState<ShootSummary[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const clearDateFilters = useCallback(() => {
    setStartDate(undefined);
    setEndDate(undefined);
  }, []);

  const fetchShoots = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: PaginatedResponse<ShootSummary> = await window.api["shoot:getAll"]({
        ...params,
        startDate,
        endDate,
      });
      setShoots(response.items);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch shoots"));
    } finally {
      setIsLoading(false);
    }
  }, [params, startDate, endDate]);

  useEffect(() => {
    if ((!startDate && !endDate) || (startDate && endDate)) {
      void fetchShoots();
    }
  }, [fetchShoots, startDate, endDate]);

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
    shoots,
    totalItems,
    totalPages,
    isLoading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    clearDateFilters,
    refetch: fetchShoots,
    addMediaToShoot,
    createShoot,
  };

  return <ShootContext.Provider value={value}>{children}</ShootContext.Provider>;
};
