import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trpc } from '../lib/trpc/client';

type ScanStatus = {
  status: 'idle' | 'scanning' | 'completed' | 'error' | 'cancelled';
  progress: number;
  totalFiles: number;
  processedFiles: number;
  currentFile?: string | undefined;
  errors: string[];
  startTime?: string | undefined;
  endTime?: string | undefined;
};

export const useScanStatus = () => {
  return useQuery({
    queryKey: ['scan-status'],
    queryFn: async (): Promise<ScanStatus> => {
      const result = await trpc.media.scanStatus.query();
      return {
        status: result.status,
        progress: result.progress,
        totalFiles: result.totalFiles,
        processedFiles: result.processedFiles,
        currentFile: result.currentFile,
        errors: result.errors,
        startTime: result.startTime,
        endTime: result.endTime,
      };
    },
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
  });
};

export const useScanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contentPath: string) =>
      trpc.media.scan.mutate({ contentPath }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-status'] });
    },
  });
};

export const useScanCancel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => trpc.media.scanCancel.mutate(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-status'] });
    },
  });
};
