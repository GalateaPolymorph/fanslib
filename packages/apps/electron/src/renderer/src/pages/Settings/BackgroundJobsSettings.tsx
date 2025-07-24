import { Button } from "@renderer/components/ui/Button";
import { Input } from "@renderer/components/ui/Input";
import { Status } from "@renderer/components/ui/Status";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { RefreshCw, Server } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SettingRow } from "./SettingRow";

type HealthStatus = "healthy" | "unhealthy" | "error" | "checking" | "idle";

export const BackgroundJobsSettings = () => {
  const { settings, saveSettings } = useSettings();
  const [healthStatus, setHealthStatus] = useState<HealthStatus>("idle");
  const [healthMessage, setHealthMessage] = useState<string>("");
  const [isChecking, setIsChecking] = useState(false);

  const updateServerUrl = useCallback(
    (url: string) => {
      saveSettings({ backgroundJobsServerUrl: url });
      setHealthStatus("idle");
      setHealthMessage("");
    },
    [saveSettings]
  );

  const performHealthCheck = useCallback(async () => {
    const serverUrl = settings?.backgroundJobsServerUrl?.trim();

    if (!serverUrl) {
      setHealthStatus("error");
      setHealthMessage("Server URL is required");
      return;
    }

    setIsChecking(true);
    setHealthStatus("checking");
    setHealthMessage("Checking server health...");

    try {
      const result = await window.api["settings:healthCheck"](serverUrl);

      setHealthStatus(result.status);
      setHealthMessage(result.message || "");
    } catch (_error) {
      setHealthStatus("error");
      setHealthMessage("Failed to check server health");
    } finally {
      setIsChecking(false);
    }
  }, [settings?.backgroundJobsServerUrl]);

  // Auto-check when URL changes and is valid
  useEffect(() => {
    const serverUrl = settings?.backgroundJobsServerUrl?.trim();
    if (serverUrl && healthStatus === "idle") {
      const timeoutId = setTimeout(() => {
        performHealthCheck();
      }, 1000);

      return () => clearTimeout(timeoutId);
    }

    return undefined;
  }, [settings?.backgroundJobsServerUrl, healthStatus, performHealthCheck]);

  const getStatusVariant = (): "success" | "error" | "warning" | "neutral" => {
    switch (healthStatus) {
      case "healthy":
        return "success";
      case "unhealthy":
      case "error":
        return "error";
      case "checking":
        return "warning";
      case "idle":
      default:
        return "neutral";
    }
  };

  const getStatusText = (): string => {
    switch (healthStatus) {
      case "healthy":
        return "Connected";
      case "unhealthy":
        return "Unhealthy";
      case "error":
        return "Connection Failed";
      case "checking":
        return "Checking...";
      case "idle":
      default:
        return "Not Connected";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Server /> Background Jobs
        </h1>
        <p className="text-muted-foreground">Configure background job server for automated tasks</p>
      </div>

      <div className="space-y-4">
      <SettingRow
        title="Server URL"
        description="URL of the background jobs server for automated Reddit posting and other tasks"
      >
        <div className="space-y-3 w-full max-w-lg">
          <Input
            type="url"
            id="background-jobs-server-url"
            placeholder="http://localhost:3000"
            value={settings?.backgroundJobsServerUrl ?? ""}
            onChange={(e) => updateServerUrl(e.target.value)}
            className="w-full"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Status variant={getStatusVariant()}>
                <span className="text-sm">{getStatusText()}</span>
              </Status>
              {healthMessage && (
                <span className="text-xs text-muted-foreground">{healthMessage}</span>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={performHealthCheck}
              disabled={isChecking || !settings?.backgroundJobsServerUrl?.trim()}
              className="ml-auto"
            >
              <RefreshCw className={`h-3 w-3 ${isChecking ? "animate-spin" : ""}`} />
              Check
            </Button>
          </div>
        </div>
      </SettingRow>
      </div>
    </div>
  );
};
