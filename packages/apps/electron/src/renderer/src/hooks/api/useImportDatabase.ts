import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatabaseImportResult, ValidationResult } from "../../../../features/settings/api-type";

export const useImportDatabase = () => {
  const queryClient = useQueryClient();

  return useMutation<DatabaseImportResult, Error, string>({
    mutationFn: async (sourcePath: string) => {
      const result = await window.api["settings:importDatabase"](sourcePath);
      return result;
    },
    onSuccess: () => {
      // Invalidate all queries since the database has changed
      queryClient.invalidateQueries();
    },
  });
};

export const useValidateImportedDatabase = () => {
  return useMutation<ValidationResult, Error, string>({
    mutationFn: async (libraryPath: string) => {
      const result = await window.api["settings:validateImportedDatabase"](libraryPath);
      return result;
    },
  });
};
