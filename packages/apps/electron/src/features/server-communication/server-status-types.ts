export type ServerStatus = "available" | "unavailable" | "checking" | "unknown";

export type ServerStatusInfo = {
  status: ServerStatus;
  lastChecked: Date | null;
  errorMessage: string | null;
  consecutiveFailures: number;
};

export type ServerStatusCallback = (statusInfo: ServerStatusInfo) => void;