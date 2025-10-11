import { MediaTile } from "@renderer/components/MediaTile";
import { RedgifsURLIndicator } from "@renderer/components/RedgifsURLIndicator";
import { Button } from "@renderer/components/ui/Button";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { Copy, Edit3, FolderOpen, RefreshCw } from "lucide-react";
import { useState } from "react";
import { MediaSelectionDialog } from "./MediaSelectionDialog";
import { useRedditQuickPostContext } from "./RedditQuickPostContext";

export const MediaSection = () => {
  const [isMediaSelectionOpen, setIsMediaSelectionOpen] = useState(false);

  const {
    postState,
    refreshMedia,
    openMediaInFinder,
    copyMediaNameToClipboard,
    selectSpecificMedia,
  } = useRedditQuickPostContext();

  const { media, subreddit, isLoading, error, totalMediaAvailable } = postState;

  const openMediaSelection = () => setIsMediaSelectionOpen(true);

  if (!subreddit) {
    return (
      <div className="p-6 rounded-lg border">
        <p className="text-lg text-gray-400">Waiting for subreddit selection</p>
      </div>
    );
  }

  if (!media) {
    if (isLoading) {
      return (
        <div className="p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <p className="text-lg text-gray-600">Selecting media...</p>
            <Button
              onClick={refreshMedia}
              variant="ghost"
              size="lg"
              disabled={isLoading}
              className="flex items-center gap-3 px-6 py-3 text-base font-medium"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-6 rounded-lg border">
          <div className="space-y-3">
            <p className="text-lg text-red-600">⚠ Failed to load media</p>
            <p className="text-sm text-gray-600">{error.message}</p>
            <Button
              onClick={refreshMedia}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (totalMediaAvailable === 0) {
      return (
        <div className="p-6 rounded-lg border">
          <div className="space-y-3">
            <p className="text-lg text-orange-600">⚠ No media available</p>
            <p className="text-sm text-gray-600">
              {subreddit.eligibleMediaFilter
                ? "No media matches the filters for this subreddit."
                : "No media found in your library."}
            </p>
            <Button
              onClick={refreshMedia}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-600">Selecting media...</p>
          <Button
            onClick={refreshMedia}
            variant="ghost"
            size="lg"
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-3 text-base font-medium"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 rounded-lg border">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32">
            <MediaSelectionProvider media={[media]}>
              <MediaTile
                withPreview
                media={media}
                withDuration
                withNavigation
                allMedias={[media]}
                index={0}
                className="w-full h-full object-cover"
              />
            </MediaSelectionProvider>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="group relative flex items-center gap-2">
                <p className="text-xl font-bold text-gray-900">{media.name}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                  {media.type === "image" && (
                    <Button
                      onClick={openMediaInFinder}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-600 hover:text-gray-900"
                      title="Open in Finder"
                    >
                      <FolderOpen className="h-4 w-4" />
                    </Button>
                  )}
                  {media.type === "video" && (
                    <Button
                      onClick={copyMediaNameToClipboard}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-gray-600 hover:text-gray-900"
                      title="Copy name to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    onClick={openMediaSelection}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-gray-600 hover:text-gray-900"
                    title="Choose different media"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={refreshMedia}
                variant="ghost"
                size="lg"
                disabled={isLoading}
                className="flex items-center gap-3 px-6 py-3 text-base font-medium"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              <RedgifsURLIndicator media={media} className="text-lg" />
            </div>
          </div>
        </div>
      </div>

      <MediaSelectionDialog
        open={isMediaSelectionOpen}
        onOpenChange={setIsMediaSelectionOpen}
        onMediaSelect={selectSpecificMedia}
        currentMedia={media}
      />
    </>
  );
};
