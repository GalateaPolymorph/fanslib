import { useCallback, useEffect, useRef, useState } from "react";
import { ServerStatusInfo } from "../../../../features/server-communication/server-status-types";

export type UseServerStatusReturn = {
  statusInfo: ServerStatusInfo;
  isAvailable: boolean;
  isUnavailable: boolean;
  isChecking: boolean;
  isUnknown: boolean;
  hasRepeatedFailures: boolean;
  unavailabilityReason: string;
  troubleshootingMessage: string;
  checkStatus: () => Promise<ServerStatusInfo>;
  startPeriodicChecking: () => void;
  stopPeriodicChecking: () => void;
};

const CHECK_INTERVAL_MS = 30000; // 30 seconds
const MAX_CONSECUTIVE_FAILURES = 3;

export const useServerStatus = (autoStart: boolean = true): UseServerStatusReturn => {
  const [statusInfo, setStatusInfo] = useState<ServerStatusInfo>({
    status: "unknown",
    lastChecked: null,
    errorMessage: null,
    consecutiveFailures: 0,
  });

  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusInfoRef = useRef(statusInfo);
  const isCheckingRef = useRef(isChecking);

  // Keep refs in sync with state
  statusInfoRef.current = statusInfo;
  isCheckingRef.current = isChecking;

  const checkStatus = useCallback(async (): Promise<ServerStatusInfo> => {
    if (isCheckingRef.current) {
      return statusInfoRef.current;
    }

    setIsChecking(true);
    setStatusInfo(prev => ({
      ...prev,
      status: "checking",
    }));

    let resultStatusInfo: ServerStatusInfo = statusInfoRef.current;

    try {
      const isAvailable = await window.api["server-communication:checkServerAvailability"]();

      setStatusInfo(prev => {
        const newStatusInfo: ServerStatusInfo = {
          status: isAvailable ? "available" : "unavailable",
          lastChecked: new Date(),
          errorMessage: isAvailable ? null : "Server is not responding",
          consecutiveFailures: isAvailable ? 0 : prev.consecutiveFailures + 1,
        };
        resultStatusInfo = newStatusInfo;
        return newStatusInfo;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error checking server";

      setStatusInfo(prev => {
        const newStatusInfo: ServerStatusInfo = {
          status: "unavailable",
          lastChecked: new Date(),
          errorMessage,
          consecutiveFailures: prev.consecutiveFailures + 1,
        };
        resultStatusInfo = newStatusInfo;
        return newStatusInfo;
      });
    } finally {
      setIsChecking(false);
    }

    return resultStatusInfo;
  }, []);

  const startPeriodicChecking = useCallback((): void => {
    if (intervalRef.current) {
      return; // Already started
    }

    // Initial check
    checkStatus();

    // Set up periodic checking
    intervalRef.current = setInterval(() => {
      checkStatus();
    }, CHECK_INTERVAL_MS);
  }, [checkStatus]);

  const stopPeriodicChecking = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (autoStart) {
      startPeriodicChecking();
    }

    return () => {
      stopPeriodicChecking();
    };
  }, [autoStart, startPeriodicChecking, stopPeriodicChecking]);

  const hasRepeatedFailures = statusInfo.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES;

  const unavailabilityReason = (() => {
    if (statusInfo.status === "available") {
      return "";
    }

    if (statusInfo.errorMessage) {
      return statusInfo.errorMessage;
    }

    if (statusInfo.status === "checking") {
      return "Checking server status...";
    }

    if (statusInfo.status === "unknown") {
      return "Server status unknown";
    }

    return "Server is unavailable";
  })();

  const troubleshootingMessage = (() => {
    if (statusInfo.status === "available") {
      return "";
    }

    const baseMessage = "Server is currently unavailable. ";

    if (hasRepeatedFailures) {
      return (
        baseMessage +
        "Please check:\n" +
        "• Server application is running\n" +
        "• Network connection is stable\n" +
        "• Firewall is not blocking the connection\n" +
        "• Server configuration is correct"
      );
    }

    if (statusInfo.consecutiveFailures > 1) {
      return baseMessage + "This may be a temporary issue. Please wait a moment and try again.";
    }

    return baseMessage + "Please check your connection and try again.";
  })();

  return {
    statusInfo: { ...statusInfo, status: isChecking ? "checking" : statusInfo.status },
    isAvailable: statusInfo.status === "available" && !isChecking,
    isUnavailable: statusInfo.status === "unavailable" && !isChecking,
    isChecking: isChecking || statusInfo.status === "checking",
    isUnknown: statusInfo.status === "unknown" && !isChecking,
    hasRepeatedFailures,
    unavailabilityReason,
    troubleshootingMessage,
    checkStatus,
    startPeriodicChecking,
    stopPeriodicChecking,
  };
};
