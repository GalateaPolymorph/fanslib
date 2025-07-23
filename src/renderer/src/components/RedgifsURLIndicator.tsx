import { Button } from "@renderer/components/ui/Button";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { useRedgifsUrl } from "@renderer/hooks/api/useRedgifsUrl";
import { useClipboard } from "@renderer/hooks/ui/useClipboard";
import { cn } from "@renderer/lib/utils";
import { ExternalLink, Loader, RefreshCw } from "lucide-react";
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
    return <p className={cn("text-sm text-green-600", className)}>✓ RedGIFs URL found</p>;
  }

  return (
    <div className={cn("group flex items-center gap-3", className)}>
      <p className="text-sm text-orange-600">⚠ No RedGIFs URL found</p>
      <Button
        onClick={refresh}
        variant="ghost"
        size="sm"
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 px-2 text-orange-600 hover:text-orange-800",
          isLoading && "opacity-100"
        )}
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
          className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800"
          title="Open Postpone content library and copy media name"
        >
          <ExternalLink className="h-3 w-3" />
          Open in Postpone
        </Button>
      )}
    </div>
  );
};
