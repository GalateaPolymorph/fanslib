import { Button } from "@renderer/components/ui/Button";
import { Status } from "@renderer/components/ui/Status";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/Tooltip";
import { cn } from "@renderer/lib/utils";
import { LogIn, RefreshCw } from "lucide-react";
import { useServerStatus } from "../hooks/useServerStatus/useServerStatus";
import { useRedditAuth } from "../hooks/useRedditAuth";
import { useAuthStatusCache } from "../hooks/useAuthStatusCache";
import { useSessionManagement } from "../hooks/useSessionManagement";
import { getAuthenticationStatus } from "../utils/authStatusUtils";

type RedditConnectionStatusProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export const RedditConnectionStatus = ({
  className,
  size = "md",
}: RedditConnectionStatusProps) => {
  const { isAvailable: isServerAvailable, isUnavailable: isServerUnavailable } = useServerStatus();
  const { sessionStatus, loginStatus, lastChecked, isStale, updateCache } = useAuthStatusCache();
  const { isLoading, loadSessionStatus } = useSessionManagement(updateCache);
  const { isLoggingIn, performLogin } = useRedditAuth(updateCache, loadSessionStatus);

  const authStatus = getAuthenticationStatus(sessionStatus, loginStatus, isLoading, isStale);

  const getStatusState = () => {
    // Server unavailable - highest priority
    if (isServerUnavailable) {
      return {
        variant: "error" as const,
        label: "Server Unavailable",
        showButton: false,
        isClickable: false,
      };
    }

    // Server available, check authentication
    if (isServerAvailable) {
      const isAuthenticated = authStatus.iconType === "success";
      const username = loginStatus?.username || sessionStatus?.session?.username;

      if (isAuthenticated && username) {
        return {
          variant: "success" as const,
          label: `Logged in as u/${username}`,
          showButton: false,
          isClickable: false,
        };
      } else {
        return {
          variant: "warning" as const,
          label: "Connected, no session",
          showButton: true,
          isClickable: false,
        };
      }
    }

    // Loading or unknown state
    return {
      variant: "neutral" as const,
      label: "Checking connection...",
      showButton: false,
      isClickable: false,
    };
  };

  const statusState = getStatusState();

  const handleLogin = async () => {
    try {
      await performLogin();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Status 
                variant={statusState.variant} 
                size={size === "md" ? "default" : size}
              >
                <span className="text-xs">{statusState.label}</span>
              </Status>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="space-y-1">
              <p className="font-medium">{statusState.label}</p>
              {lastChecked && (
                <p className="text-xs text-muted-foreground">
                  Last checked: {lastChecked}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {statusState.showButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="h-6 px-2 text-xs"
        >
          {isLoggingIn ? (
            <RefreshCw size={12} className="animate-spin mr-1" />
          ) : (
            <LogIn size={12} className="mr-1" />
          )}
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      )}
    </div>
  );
};