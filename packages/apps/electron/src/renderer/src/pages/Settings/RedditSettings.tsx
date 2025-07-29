import { Button } from "@renderer/components/ui/Button";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { AlertTriangle, CheckCircle, Clock, RefreshCcw, Trash2, UserCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SettingRow } from "./SettingRow";

type SessionStatus = {
  hasSession: boolean;
  isValid: boolean;
  session?: {
    id: string;
    username: string | null;
    expiresAt: string;
    isValid: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export const RedditSettings = () => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const loadSessionStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const status = await window.api["server-communication:getSessionStatus"]();
      setSessionStatus(status);
    } catch (error) {
      console.error("Failed to load session status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load Reddit session status",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleTransferSession = useCallback(async () => {
    try {
      setIsTransferring(true);
      const result = await window.api["server-communication:transferSession"]();

      if (result) {
        toast({
          title: "Success",
          description: `Reddit session transferred successfully${result.username ? ` for u/${result.username}` : ""}`,
        });
        await loadSessionStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Transfer Failed",
          description:
            "No Reddit session found in Electron app. Please log in to Reddit first through the app.",
        });
      }
    } catch (error) {
      console.error("Failed to transfer session:", error);
      toast({
        variant: "destructive",
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsTransferring(false);
    }
  }, [toast, loadSessionStatus]);

  const handleClearSession = useCallback(async () => {
    try {
      setIsClearing(true);
      const success = await window.api["server-communication:clearSession"]();

      if (success) {
        toast({
          title: "Session Cleared",
          description: "Reddit session has been removed from the server",
        });
        await loadSessionStatus();
      } else {
        toast({
          variant: "destructive",
          title: "Clear Failed",
          description: "Failed to clear Reddit session",
        });
      }
    } catch (error) {
      console.error("Failed to clear session:", error);
      toast({
        variant: "destructive",
        title: "Clear Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsClearing(false);
    }
  }, [toast, loadSessionStatus]);

  const handleRefreshStatus = useCallback(async () => {
    await loadSessionStatus();
    toast({
      title: "Status Refreshed",
      description: "Reddit session status has been updated",
    });
  }, [loadSessionStatus, toast]);

  useEffect(() => {
    loadSessionStatus();
  }, [loadSessionStatus]);

  const getStatusDisplay = () => {
    if (isLoading) {
      return {
        icon: <RefreshCcw className="h-4 w-4 animate-spin" />,
        text: "Checking...",
        color: "text-muted-foreground",
      };
    }

    if (!sessionStatus?.hasSession) {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "No session",
        color: "text-destructive",
      };
    }

    if (!sessionStatus.isValid) {
      return {
        icon: <Clock className="h-4 w-4" />,
        text: "Session expired",
        color: "text-yellow-600",
      };
    }

    return {
      icon: <CheckCircle className="h-4 w-4" />,
      text: `Connected${sessionStatus.session?.username ? ` as u/${sessionStatus.session.username}` : ""}`,
      color: "text-green-600",
    };
  };

  const statusDisplay = getStatusDisplay();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Reddit Integration</h2>
        <p className="text-sm text-muted-foreground">
          Manage Reddit authentication for automated posting via the server
        </p>
      </div>

      <div className="space-y-4">
        <SettingRow
          title="Session Status"
          description="Current Reddit authentication status on the server"
        >
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-2 ${statusDisplay.color}`}>
              {statusDisplay.icon}
              {statusDisplay.text}
            </span>
            <Button variant="outline" size="sm" onClick={handleRefreshStatus} disabled={isLoading}>
              <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </SettingRow>

        {sessionStatus?.session && (
          <SettingRow
            title="Session Details"
            description="Information about the current Reddit session"
          >
            <div className="space-y-2 text-sm">
              {sessionStatus.session.username && (
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Username: u/{sessionStatus.session.username}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Expires: {formatDate(sessionStatus.session.expiresAt)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {formatDate(sessionStatus.session.createdAt)}
              </div>
            </div>
          </SettingRow>
        )}

        <SettingRow
          title="Transfer Session"
          description="Copy Reddit session from Electron app to server for automated posting"
        >
          <Button
            onClick={handleTransferSession}
            disabled={isTransferring}
            className="w-full sm:w-auto"
          >
            {isTransferring ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              "Transfer Session"
            )}
          </Button>
        </SettingRow>

        {sessionStatus?.hasSession && (
          <SettingRow
            title="Clear Session"
            description="Remove Reddit session from server (will require re-authentication)"
          >
            <Button
              variant="destructive"
              onClick={handleClearSession}
              disabled={isClearing}
              className="w-full sm:w-auto"
            >
              {isClearing ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Session
                </>
              )}
            </Button>
          </SettingRow>
        )}
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-medium text-yellow-800">How Reddit Authentication Works</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>
                1. <strong>Authenticate in Electron:</strong> Log in to Reddit through the
                app&apos;s posting interface
              </p>
              <p>
                2. <strong>Transfer Session:</strong> Click &quot;Transfer Session&quot; to copy
                your login to the server
              </p>
              <p>
                3. <strong>Automated Posting:</strong> Server can now post to Reddit automatically
                using your session
              </p>
              <p>
                4. <strong>Session Expiry:</strong> Sessions typically last 24-48 hours, after which
                you&apos;ll need to re-authenticate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
