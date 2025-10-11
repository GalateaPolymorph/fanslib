import { createContext, useContext, type ReactNode } from "react";
import { Media } from "../../../features/library/entity";
import { useLibraryQuery } from "../hooks/api/useLibrary";

type LibraryContextType = {
  media: Media[];
  totalItems: number;
  totalPages: number;
  error: string | null;
  isLoading: boolean;
  refetch: () => Promise<void>;
};

const LibraryContext = createContext<LibraryContextType | null>(null);

type LibraryProviderProps = {
  children: ReactNode;
};

export const LibraryProvider = ({ children }: LibraryProviderProps) => {
  const { data, error, isLoading, refetch } = useLibraryQuery();

  const contextValue: LibraryContextType = {
    media: data?.items || [],
    totalItems: data?.total || 0,
    totalPages: data?.totalPages || 1,
    error: error ? (error instanceof Error ? error.message : "Failed to fetch library") : null,
    isLoading,
    refetch: async () => {
      await refetch();
    },
  };

  return <LibraryContext.Provider value={contextValue}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};
