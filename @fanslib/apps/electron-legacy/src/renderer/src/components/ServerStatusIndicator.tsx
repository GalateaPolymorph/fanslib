import { Badge } from "@renderer/components/ui/Badge";
import { Button } from "@renderer/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/Tooltip";
import { cn } from "@renderer/lib/utils";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  HelpCircleIcon,
  Loader2Icon,
  RefreshCwIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useServerStatus } from "../hooks/useServerStatus/useServerStatus";

type ServerStatusIndicatorProps = {
  className?: string;
  showLabel?: boolean;
  showTroubleshooting?: boolean;
  showRetryButton?: boolean;
  size?: "sm" | "md" | "lg";
};

export const ServerStatusIndicator = ({
  className,
  showLabel = true,
  showTroubleshooting = false,
  showRetryButton = true,
  size = "md",
}: ServerStatusIndicatorProps) => {
  const {
    statusInfo,
    isAvailable,
    isUnavailable,
    isChecking,
    hasRepeatedFailures,
    unavailabilityReason,
    troubleshootingMessage,
    checkStatus,
  } = useServerStatus();

  const [isManuallyChecking, setIsManuallyChecking] = useState(false);

  const handleManualCheck = async () => {
    setIsManuallyChecking(true);
    try {
      await checkStatus();
    } finally {
      setIsManuallyChecking(false);
    }
  };

  const getStatusConfig = () => {
    if (isAvailable) {
      return {
        variant: "default" as const,
        icon: CheckCircleIcon,
        label: "Server Connected",
        className: "text-green-700 bg-green-50 border-green-200",
        iconClassName: "text-green-600",
      };
    }

    if (isChecking || isManuallyChecking) {
      return {
        variant: "secondary" as const,
        icon: Loader2Icon,
        label: "Checking...",
        className: "text-blue-700 bg-blue-50 border-blue-200",
        iconClassName: "text-blue-600 animate-spin",
      };
    }

    if (isUnavailable) {
      return {
        variant: "destructive" as const,
        icon: hasRepeatedFailures ? XCircleIcon : AlertCircleIcon,
        label: hasRepeatedFailures ? "Server Offline" : "Server Unavailable",
        className: "text-red-700 bg-red-50 border-red-200",
        iconClassName: "text-red-600",
      };
    }

    // Unknown status
    return {
      variant: "secondary" as const,
      icon: HelpCircleIcon,
      label: "Status Unknown",
      className: "text-gray-700 bg-gray-50 border-gray-200",
      iconClassName: "text-gray-600",
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const iconSize = size === "sm" ? 12 : size === "md" ? 14 : 16;
  const badgeSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

  const indicator = (
    <Badge variant={config.variant} className={cn(badgeSize, config.className, className)}>
      <Icon size={iconSize} className={cn("mr-1", config.iconClassName)} />
      {showLabel && config.label}
    </Badge>
  );

  const tooltipContent = (
    <div className="space-y-2 max-w-xs">
      <div className="font-medium">{config.label}</div>

      {statusInfo.lastChecked && (
        <div className="text-xs text-muted-foreground">
          Last checked: {statusInfo.lastChecked.toLocaleTimeString()}
        </div>
      )}

      {unavailabilityReason && <div className="text-xs">{unavailabilityReason}</div>}

      {showTroubleshooting && troubleshootingMessage && (
        <div className="text-xs border-t pt-2 mt-2 whitespace-pre-line">
          {troubleshootingMessage}
        </div>
      )}

      {!isChecking && !isManuallyChecking && (
        <Button variant="ghost" size="sm" onClick={handleManualCheck} className="h-6 px-2 text-xs">
          <RefreshCwIcon size={10} className="mr-1" />
          Check Now
        </Button>
      )}
    </div>
  );

  const retryButton = showRetryButton && (isUnavailable || isAvailable) && !isChecking && !isManuallyChecking && (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleManualCheck}
      className="h-6 w-6 p-0 ml-2 text-muted-foreground hover:text-foreground"
    >
      <RefreshCwIcon size={12} />
    </Button>
  );

  return (
    <div className={cn("flex items-center", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{indicator}</TooltipTrigger>
          <TooltipContent side="bottom" className="p-3">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {retryButton}
    </div>
  );
};

