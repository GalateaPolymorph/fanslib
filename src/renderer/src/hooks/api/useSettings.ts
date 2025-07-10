import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettings as useSettingsContext } from "../../contexts/SettingsContext";

export const useSettings = useSettingsContext;

export const useUpdateSettings = () => {
  const { saveSettings } = useSettingsContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Parameters<typeof saveSettings>[0]) => {
      saveSettings(updates);
      // Return the updated settings
      return window.api["settings:load"]();
    },
    onSuccess: () => {
      // Invalidate settings-related queries
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};