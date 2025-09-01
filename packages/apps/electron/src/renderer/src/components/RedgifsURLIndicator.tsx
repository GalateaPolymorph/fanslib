import { Button } from "@renderer/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/Tooltip";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { useRedgifsUrl } from "@renderer/hooks/api/useRedgifsUrl";
import { useClipboard } from "@renderer/hooks/ui/useClipboard";
import { cn } from "@renderer/lib/utils";
import { AlertTriangle, CheckCircle, ExternalLink, Loader, RefreshCw } from "lucide-react";
import { Media } from "../../../features/library/entity";

type RedgifsURLIndicatorProps = {
  media: Media;
  className?: string;
};

export const RedgifsURLIndicator = ({ media, className }: RedgifsURLIndicatorProps) => {
  const { toast } = useToast();
  const { settings } = useSettings();
  const { copyToClipboard } = useClipboard();
  const { url, isLoading, refresh } = useRedgifsUrl(media);
  console.log(isLoading);

  const hasPostponeCredentials = !!settings?.postponeToken;

  const openPostponeContentLibrary = () => {
    if (!media) return;

    try {
      window.open("https://www.postpone.app/content-library", "_blank", "noopener,noreferrer");
      copyToClipboard(media.name);
      toast({
        headline: "Postpone Opened",
        description: "Content library opened and media name copied to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        headline: "Failed to Open Postpone",
        description: "Could not open Postpone content library.",
      });
    }
  };

  if (media.type !== "video") {
    return null;
  }

  if (url) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <CheckCircle className="h-3 w-3 text-green-600" />
        <p className="text-xs text-green-600">RedGIFs URL found</p>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertTriangle className="h-3 w-3 text-orange-600" />
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="space-y-2">
              <p className="font-medium">No RedGIFs URL found</p>
              <p className="text-xs text-muted-foreground">
                This video needs a RedGIFs URL to be posted to Reddit
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        onClick={refresh}
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 text-orange-600 hover:text-orange-800"
        title="Refresh RedGIFs URL"
      >
        {isLoading ? (
          <Loader className="h-3 w-3 animate-spin" />
        ) : (
          <RefreshCw className="h-3 w-3" />
        )}
      </Button>

      {hasPostponeCredentials && (
        <Button
          onClick={openPostponeContentLibrary}
          variant="ghost"
          size="sm"
          className="h-4 px-2 text-xs text-purple-600 hover:text-purple-800"
          title="Open Postpone content library and copy media name"
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Postpone
        </Button>
      )}
    </div>
  );
};
