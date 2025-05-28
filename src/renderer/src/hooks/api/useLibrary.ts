import { useQuery } from "@tanstack/react-query";
import { GetAllMediaParams } from "../../../../features/library/api-type";
import { useLibraryPreferences } from "../../contexts/LibraryPreferencesContext";
import { useSettings } from "../../contexts/SettingsContext";

export const libraryQueryKeys = {
  all: ["library"] as const,
  list: (params: GetAllMediaParams) => ["library", "list", params] as const,
};

export const useLibraryQuery = () => {
  const { settings } = useSettings();
  const { preferences } = useLibraryPreferences();

  const params: GetAllMediaParams = {
    page: preferences.pagination.page,
    limit: preferences.pagination.limit,
    sort: preferences.sort,
    ...preferences.filter,
  };

  return useQuery({
    queryKey: libraryQueryKeys.list(params),
    queryFn: async () => {
      if (!settings?.libraryPath) {
        throw new Error("Library path not set");
      }
      return window.api["library:getAll"](params);
    },
    enabled: !!settings?.libraryPath,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};
