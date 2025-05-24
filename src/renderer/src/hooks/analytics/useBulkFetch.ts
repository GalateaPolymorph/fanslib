import { useEffect, useState } from "react";
import { BulkFetchProgress, BulkFetchResult } from "../../components/analytics/BulkFetchProgress";

type UseBulkFetchResult = {
  fetchProgress: BulkFetchProgress | null;
  fetchResult: BulkFetchResult | null;
  isFetching: boolean;
  startBulkFetch: (
    fetchRequest: string,
    analyticsTimeframe: { startDate: Date; endDate: Date }
  ) => Promise<void>;
  resetFetch: () => void;
};

export const useBulkFetch = (onFetchComplete?: () => void): UseBulkFetchResult => {
  const [fetchProgress, setFetchProgress] = useState<BulkFetchProgress | null>(null);
  const [fetchResult, setFetchResult] = useState<BulkFetchResult | null>(null);

  useEffect(() => {
    window.api["analytics:onBulkFetchProgress"]((_event, progress) => {
      setFetchProgress(progress);
    });

    window.api["analytics:onBulkFetchComplete"]((_event, result) => {
      setFetchProgress(null);
      setFetchResult(result);
      onFetchComplete?.();
    });
  }, [onFetchComplete]);

  const resetFetch = () => {
    setFetchProgress(null);
    setFetchResult(null);
  };

  const startBulkFetch = async (
    fetchRequest: string,
    analyticsTimeframe: { startDate: Date; endDate: Date }
  ) => {
    resetFetch();
    try {
      // First update credentials
      await window.api["analytics:updateFanslyCredentialsFromFetch"](fetchRequest);
      // Then start bulk fetch with analytics timeframe
      await window.api["analytics:bulkFetchAnalytics"]({
        analyticsStartDate: analyticsTimeframe.startDate.toISOString(),
        analyticsEndDate: analyticsTimeframe.endDate.toISOString(),
      });
    } catch (error) {
      console.error("Failed to start bulk fetch:", error);
      throw error;
    }
  };

  return {
    fetchProgress,
    fetchResult,
    isFetching: fetchProgress !== null,
    startBulkFetch,
    resetFetch,
  };
};
