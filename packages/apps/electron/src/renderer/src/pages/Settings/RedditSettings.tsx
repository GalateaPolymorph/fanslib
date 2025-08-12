import { Button } from "@renderer/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/Tooltip";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { AlertTriangle, CheckCircle, Clock, RefreshCcw, Trash2, LogIn } from "lucide-react";
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

type CachedAuthStatus = {
  sessionStatus: SessionStatus | null;
  loginStatus: { isLoggedIn: boolean; username?: string } | null;
  lastChecked: string;
};

const STORAGE_KEY = "reddit-auth-status";
const STALE_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const loadCachedStatus = (): CachedAuthStatus | null => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn("Failed to load cached auth status:", error);
    return null;
  }
};

const saveCachedStatus = (
  sessionStatus: SessionStatus | null,
  loginStatus: { isLoggedIn: boolean; username?: string } | null
) => {
  try {
    const cached: CachedAuthStatus = {
      sessionStatus,
      loginStatus,
      lastChecked: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.warn("Failed to save cached auth status:", error);
  }
};

const isStatusStale = (lastChecked: string): boolean => {
  const lastCheckedTime = new Date(lastChecked).getTime();
  const now = new Date().getTime();
  return now - lastCheckedTime > STALE_THRESHOLD;
};

export const RedditSettings = () => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(() => {
    const cached = loadCachedStatus();
    return cached?.sessionStatus || null;
  });
  const [loginStatus, setLoginStatus] = useState<{ isLoggedIn: boolean; username?: string } | null>(
    () => {
      const cached = loadCachedStatus();
      return cached?.loginStatus || null;
    }
  );
  const [lastChecked, setLastChecked] = useState<string | null>(() => {
    const cached = loadCachedStatus();
    return cached?.lastChecked || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);
  const { toast } = useToast();

  const loadSessionStatus = useCallback(
    async (username?: string) => {
      try {
        setIsLoading(true);
        const status = await window.api["server-communication:getSessionStatus"](username);
        setSessionStatus(status);
        return status;
      } catch (error) {
        console.error("Failed to load session status:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load Reddit session status",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const handleClearSession = useCallback(async () => {
    try {
      setIsClearing(true);
      const username = loginStatus?.username || sessionStatus?.session?.username;
      const success = await window.api["server-communication:clearSession"](username);

      if (success) {
        toast({
          title: "Session Cleared",
          description: "Reddit session has been removed from the server",
        });
        const newSessionStatus = await loadSessionStatus(username);
        setLoginStatus(null);
        const now = new Date().toISOString();
        setLastChecked(now);
        saveCachedStatus(newSessionStatus, null);
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
  }, [toast, loadSessionStatus, loginStatus, sessionStatus]);

  const handleRefreshStatus = useCallback(async () => {
    setIsCheckingLogin(true);
    try {
      const result = await window.api["reddit-poster:checkLoginStatus"]();
      setLoginStatus(result);
      const status = await window.api["server-communication:getSessionStatus"](result.username);
      setSessionStatus(status);
      const now = new Date().toISOString();
      setLastChecked(now);
      saveCachedStatus(status, result);
      toast({
        title: "Status Refreshed",
        description: "Reddit authentication status has been updated",
      });
    } catch (error) {
      console.error("Failed to refresh status:", error);
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsCheckingLogin(false);
    }
  }, [toast]);

  const handleRedditLogin = useCallback(async () => {
    try {
      setIsLoggingIn(true);
      const result = await window.api["reddit-poster:loginToReddit"]();

      if (result) {
        toast({
          title: "Login Successful",
          description: "Successfully logged in to Reddit and session saved",
        });

        // Add small delay to allow user to see any browser messages
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Try to transfer session to server after successful login
        try {
          // Check login status to get the current username
          const loginResult = await window.api["reddit-poster:checkLoginStatus"]();

          if (loginResult.isLoggedIn && loginResult.username) {
            const sessionResponse = await window.api["server-communication:transferSession"](
              loginResult.username
            );

            if (sessionResponse) {
              toast({
                title: "Session Transferred",
                description: `Session transferred to server for u/${loginResult.username}`,
              });
              setLoginStatus(loginResult);
              const newSessionStatus = await loadSessionStatus(loginResult.username);
              const now = new Date().toISOString();
              setLastChecked(now);
              saveCachedStatus(newSessionStatus, loginResult);
            } else {
              throw new Error("Session transfer returned null");
            }
          } else {
            throw new Error("Unable to verify login status after login");
          }
        } catch (transferError) {
          console.warn("Failed to auto-transfer session:", transferError);
          toast({
            variant: "default",
            title: "Server Sync Issue",
            description:
              "Login successful, but there was an issue syncing with the server. Try refreshing the session status.",
          });
          // Still try to update the login status even if transfer fails
          try {
            const loginResult = await window.api["reddit-poster:checkLoginStatus"]();
            setLoginStatus(loginResult);
            const newSessionStatus = await loadSessionStatus();
            const now = new Date().toISOString();
            setLastChecked(now);
            saveCachedStatus(newSessionStatus, loginResult);
          } catch (statusError) {
            console.warn("Failed to update status after transfer error:", statusError);
          }
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Failed to complete Reddit login. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to login to Reddit:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoggingIn(false);
    }
  }, [toast, loadSessionStatus]);

  useEffect(() => {
    // Don't auto-fetch on mount - rely on cached data and manual refresh
    // This prevents unnecessary API calls every time the component mounts
  }, []);

  const isStale = lastChecked ? isStatusStale(lastChecked) : true;

  const getAuthenticationStatus = () => {
    if (isLoading) {
      return {
        icon: <RefreshCcw className="h-4 w-4 animate-spin" />,
        text: "Checking authentication...",
        color: "text-muted-foreground",
        details: null,
        isStale: false,
      };
    }

    const hasServerSession = sessionStatus?.hasSession && sessionStatus?.isValid;
    const isLoggedInDirectly = loginStatus?.isLoggedIn;
    const serverUsername = sessionStatus?.session?.username;
    const directUsername = loginStatus?.username;

    if (hasServerSession && isLoggedInDirectly && serverUsername === directUsername) {
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        text: `Connected as u/${serverUsername}`,
        color: isStale ? "text-yellow-600" : "text-green-600",
        details: sessionStatus.session
          ? `Session expires: ${formatDate(sessionStatus.session.expiresAt)}`
          : null,
        isStale,
      };
    }

    if (hasServerSession && isLoggedInDirectly && serverUsername !== directUsername) {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        text: "Username mismatch",
        color: "text-yellow-600",
        details: `Server: u/${serverUsername}, Current: u/${directUsername}`,
        isStale,
      };
    }

    if (hasServerSession && !isLoggedInDirectly) {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        text: `Server session active (u/${serverUsername}) but not logged in`,
        color: "text-yellow-600",
        details: sessionStatus.session
          ? `Session expires: ${formatDate(sessionStatus.session.expiresAt)}`
          : null,
        isStale,
      };
    }

    if (!hasServerSession && isLoggedInDirectly) {
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        text: `Logged in as u/${directUsername} but no server session`,
        color: "text-yellow-600",
        details: "Login to Reddit to save session to server",
        isStale,
      };
    }

    if (sessionStatus?.hasSession && !sessionStatus?.isValid) {
      return {
        icon: <Clock className="h-4 w-4" />,
        text: `Session expired (u/${serverUsername})`,
        color: "text-yellow-600",
        details: "Login again to restore session",
        isStale,
      };
    }

    return {
      icon: <AlertTriangle className="h-4 w-4" />,
      text: "Not authenticated",
      color: "text-destructive",
      details: "Click 'Login to Reddit' to authenticate",
      isStale,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatLastChecked = (lastCheckedString: string) => {
    const lastCheckedDate = new Date(lastCheckedString);
    const now = new Date();
    const diffMs = now.getTime() - lastCheckedDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    } else {
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }
  };

  const authStatus = getAuthenticationStatus();

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
          title="Reddit Authentication"
          description="Current authentication status and session management"
        >
          <div className="space-y-4">
            {/* Authentication Status */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className={`flex items-center gap-2 ${authStatus.color}`}>
                  {authStatus.icon}
                  <span className="font-medium">{authStatus.text}</span>
                  {authStatus.isStale && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Stale
                    </span>
                  )}
                </div>
                {authStatus.details && (
                  <div className="text-sm text-muted-foreground mt-1">{authStatus.details}</div>
                )}
                {lastChecked && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Last checked: {formatLastChecked(lastChecked)}
                    {isStale && " (data may be outdated)"}
                  </div>
                )}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshStatus}
                    disabled={isLoading || isCheckingLogin}
                  >
                    <RefreshCcw
                      className={`h-4 w-4 ${isLoading || isCheckingLogin ? "animate-spin" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Check authentication status</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Authentication Actions */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <Button onClick={handleRedditLogin} disabled={isLoggingIn} size="sm">
                {isLoggingIn ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login to Reddit
                  </>
                )}
              </Button>

              {sessionStatus?.hasSession && (
                <Button
                  variant="destructive"
                  onClick={handleClearSession}
                  disabled={isClearing}
                  size="sm"
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
              )}
            </div>
          </div>
        </SettingRow>
      </div>
    </div>
  );
};
