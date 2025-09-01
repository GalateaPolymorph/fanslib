import { Button } from "@renderer/components/ui/Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/Tooltip";
import { RefreshCcw, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { formatLastChecked } from "../../utils/dateFormatting";
import { AuthStatus } from "../../utils/authStatusUtils";
import { Status } from "../ui/Status";

type AuthenticationStatusProps = {
  authStatus: AuthStatus;
  lastChecked: string | null;
  isLoading: boolean;
  isCheckingLogin: boolean;
  onRefresh: () => void;
  variant?: "default" | "compact";
};

const getIconForType = (iconType: AuthStatus["iconType"], isLoading: boolean) => {
  const className = "h-4 w-4";

  switch (iconType) {
    case "loading":
      return <RefreshCcw className={`${className} animate-spin`} />;
    case "success":
      return <CheckCircle className={className} />;
    case "warning":
      return <AlertTriangle className={className} />;
    case "expired":
      return <Clock className={className} />;
    case "error":
      return <AlertTriangle className={className} />;
    default:
      return <RefreshCcw className={`${className} ${isLoading ? "animate-spin" : ""}`} />;
  }
};

export const AuthenticationStatus = ({
  authStatus,
  lastChecked,
  isLoading,
  isCheckingLogin,
  onRefresh,
  variant = "default",
}: AuthenticationStatusProps) => {
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1 text-sm">
        <div className={`flex items-center gap-2 ${authStatus.color}`}>
          <Status
            variant={
              authStatus.iconType === "success"
                ? "success"
                : authStatus.iconType === "error"
                  ? "error"
                  : "warning"
            }
          >
            {authStatus.text}
          </Status>
          {authStatus.isStale && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
              Stale
            </span>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading || isCheckingLogin}
            >
              <RefreshCcw
                className={`h-3 w-3 ${isLoading || isCheckingLogin ? "animate-spin" : ""}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Recheck status</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  // Default variant (original layout)
  return (
    <div className="flex items-center gap-2 justify-between">
      <div className="flex-1">
        <div className={`flex items-center gap-2 ${authStatus.color}`}>
          {getIconForType(authStatus.iconType, isLoading || isCheckingLogin)}
          <span className="font-medium">{authStatus.text}</span>
          {authStatus.isStale && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Stale</span>
          )}
        </div>
        {authStatus.details && (
          <div className="text-sm text-muted-foreground mt-1">{authStatus.details}</div>
        )}
        {lastChecked && (
          <div className="text-xs text-muted-foreground mt-1">
            Last checked: {formatLastChecked(lastChecked)}
            {authStatus.isStale && " (data may be outdated)"}
          </div>
        )}
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading || isCheckingLogin}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isLoading || isCheckingLogin ? "animate-spin" : ""}`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Recheck authentication status</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
