import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";
import { FanslyPostWithAnalytics } from "../../../features/analytics/post-analytics/api-type";

export type AnalyticsTimeframe = {
  startDate: Date;
  endDate: Date;
};

export type SortConfig = {
  sortBy: string;
  sortDirection: "asc" | "desc";
};

type AnalyticsContextType = {
  timeframe: AnalyticsTimeframe;
  setTimeframe: (timeframe: AnalyticsTimeframe) => void;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  posts: FanslyPostWithAnalytics[];
  isLoading: boolean;
  error: Error | null;
};

// Set default to last 30 days
const defaultTimeframe: AnalyticsTimeframe = {
  startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
  endDate: new Date(),
};

const defaultSortConfig: SortConfig = {
  sortBy: "date",
  sortDirection: "desc",
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>(defaultTimeframe);
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSortConfig);

  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fanslyPosts", sortConfig, timeframe],
    queryFn: () =>
      window.api["analytics:getFanslyPostsWithAnalytics"](
        sortConfig.sortBy,
        sortConfig.sortDirection,
        timeframe.startDate.toISOString(),
        timeframe.endDate.toISOString()
      ),
  });

  return (
    <AnalyticsContext.Provider
      value={{
        timeframe,
        setTimeframe,
        sortConfig,
        setSortConfig,
        posts,
        isLoading,
        error,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }

  return context;
};
