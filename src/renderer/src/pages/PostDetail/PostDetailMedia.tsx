import { MediaTile } from "@renderer/components/MediaTile";
import { Button } from "@renderer/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { useToast } from "@renderer/components/ui/use-toast";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { useOsDrag } from "@renderer/hooks";
import { useRemoveMediaFromPost } from "@renderer/hooks/api/usePost";
import { cn } from "@renderer/lib/utils";
import { Folder, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Media } from "src/features/library/entity";
import { Post } from "src/features/posts/entity";
import { PostDetailAddMediaButton } from "./PostDetailAddMediaButton";

type PostDetailMediaProps = {
  post: Post;
  isDraggingMedia?: boolean;
  variant?: "default" | "detail";
};

export const PostDetailMedia = ({
  post,
  isDraggingMedia = false,
  variant = "default",
}: PostDetailMediaProps) => {
  const { toast } = useToast();
  const { startOsDrag } = useOsDrag();
  const { settings } = useSettings();
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const removeMediaMutation = useRemoveMediaFromPost();

  const removeMediaFromPost = async (postMediaId: string) => {
    // Find the postMedia item to get the media ID for invalidation
    const postMediaItem = post.postMedia.find((pm) => pm.id === postMediaId);
    if (!postMediaItem) return;

    try {
      await removeMediaMutation.mutateAsync({
        postId: post.id,
        postMediaIdsToRemove: [postMediaId],
        mediaIdsToInvalidate: [postMediaItem.media.id],
      });
      setConfirmingDelete(null);
    } catch (error) {
      console.error("Failed to remove media from post:", error);
    }
  };

  const revealInFinder = async (media: Media) => {
    try {
      if (settings?.libraryPath) {
        const mediaPath =
          settings.libraryPath +
          (settings.libraryPath.endsWith("/") ? "" : "/") +
          media.relativePath;
        await window.api["os:revealInFinder"](mediaPath);
      }
    } catch (error) {
      console.error("Failed to reveal in finder:", error);
      toast({
        title: "Failed to reveal in finder",
        variant: "destructive",
      });
    }
  };

  const handleOsDragStart = async (media: Media) => {
    await startOsDrag([media]);
  };

  return (
    <TooltipProvider>
      <MediaSelectionProvider media={post.postMedia.map((pm) => pm.media)}>
        <div
          className={cn(
            "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1",
            variant === "detail" && "grid-cols-1 sm:grid-cols-1 md:grid-cols-2"
          )}
        >
          {post.postMedia.map((postMedia, index) => (
            <Tooltip key={postMedia.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <div
                  className="group relative aspect-square cursor-pointer rounded-lg overflow-hidden"
                  draggable
                  onDragStart={(e) => {
                    e.preventDefault();
                    handleOsDragStart(postMedia.media);
                  }}
                >
                  <div
                    className={cn("absolute inset-0 z-10 border-2 border-transparent rounded-lg")}
                  >
                    <MediaTile
                      media={postMedia.media}
                      index={index}
                      allMedias={post.postMedia.map((pm) => pm.media)}
                      withPreview
                      withDuration
                      withNavigation
                    />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="flex gap-1 p-1.5 bg-background border border-border"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-accent-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    revealInFinder(postMedia.media);
                  }}
                >
                  <Folder size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size={confirmingDelete === postMedia.id ? "default" : "icon"}
                  className={cn(
                    "h-7 text-muted-foreground hover:text-destructive transition-all duration-100",
                    confirmingDelete === postMedia.id ? "w-[72px] px-2" : "w-7"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirmingDelete === postMedia.id) {
                      removeMediaFromPost(postMedia.id);
                    } else {
                      setConfirmingDelete(postMedia.id);
                    }
                  }}
                  onMouseLeave={() => setConfirmingDelete(null)}
                  disabled={removeMediaMutation.isPending}
                >
                  <div className="flex items-center gap-1.5">
                    <Trash2Icon size={14} />
                    {confirmingDelete === postMedia.id && (
                      <span className="text-xs">
                        {removeMediaMutation.isPending ? "..." : "Sure?"}
                      </span>
                    )}
                  </div>
                </Button>
              </TooltipContent>
            </Tooltip>
          ))}
          <PostDetailAddMediaButton
            post={post}
            isDraggingMedia={isDraggingMedia}
            variant={variant}
          />
        </div>
      </MediaSelectionProvider>
    </TooltipProvider>
  );
};
