export type ScanError = {
  type: string;
  message: string;
  filePath?: string;
};

export type ScanResults = {
  totalFiles: number;
  newFiles: number;
  updatedFiles: number;
  removedFiles: number;
  errors: ScanError[];
};

export type ScanResponse = {
  success: boolean;
  results: ScanResults;
};

export type ScanStatusResponse = {
  isScanning: boolean;
  lastScanAt: string | null;
  progress: number;
  totalFiles: number;
  processedFiles: number;
  errors: string[];
};

export type CancelResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      error: {
        type: string;
        message: string;
      };
    };
