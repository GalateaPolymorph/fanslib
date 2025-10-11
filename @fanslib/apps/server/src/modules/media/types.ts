export type MediaProcessingProgressCallback = (
  currentFile: string,
  operation: 'metadata' | 'thumbnail' | 'database'
) => void;

export type BatchProgressCallback = (
  processed: number,
  total: number,
  currentFile?: string,
  operation?: 'metadata' | 'thumbnail' | 'database'
) => void;

export type MediaSyncError = {
  type:
    | 'database_error'
    | 'validation_error'
    | 'shoot_assignment_error'
    | 'metadata_error'
    | 'thumbnail_error';
  message: string;
  filePath: string;
};

export type MediaSyncResult = {
  success: boolean;
  totalFiles: number;
  newFiles: number;
  updatedFiles: number;
  errors: MediaSyncError[];
};
