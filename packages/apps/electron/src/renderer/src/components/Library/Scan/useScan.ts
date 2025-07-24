import { useEffect, useState } from "react";
import { LibraryScanProgress, LibraryScanResult } from "../../../../../features/library/api-type";

type UseScanResult = {
  scanProgress: LibraryScanProgress | null;
  scanResult: LibraryScanResult | null;
  isScanning: boolean;
  handleScan: () => Promise<void>;
  resetScan: () => void;
};

export const useScan = (onScanComplete?: () => void): UseScanResult => {
  const [scanProgress, setScanProgress] = useState<LibraryScanProgress | null>(null);
  const [scanResult, setScanResult] = useState<LibraryScanResult | null>(null);

  useEffect(() => {
    window.api["library:onScanProgress"]((_event, progress) => {
      setScanProgress(progress);
    });

    window.api["library:onScanComplete"]((_event, result) => {
      setScanProgress(null);
      setScanResult(result);
      onScanComplete?.();
    });
  }, [onScanComplete]);

  const resetScan = () => {
    setScanProgress(null);
    setScanResult(null);
  };

  const handleScan = async () => {
    resetScan();
    try {
      await window.api["library:scan"]();
    } catch (error) {
      console.error("Failed to scan library:", error);
    }
  };

  return {
    scanProgress,
    scanResult,
    isScanning: scanProgress !== null,
    handleScan,
    resetScan,
  };
};
