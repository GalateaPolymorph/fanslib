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
import { cn } from "@renderer/lib/utils";
import { EyeIcon, EyeOffIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { PostDetailAddMediaButton } from "./PostDetailAddMediaButton";
import { Post } from "src/features/posts/entity";

type PostDetailMediaProps = {
  post: Post;
  onUpdate: () => Promise<void>;
  isDraggingMedia?: boolean;
};

export const PostDetailMedia = ({
  post,
  onUpdate,
  isDraggingMedia = false,
}: PostDetailMediaProps) => {
  const { toast } = useToast();
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const handleToggleFreePreview = async (mediaId: string, isFreePreview: boolean) => {
    try {
      await window.api["post:setFreePreview"](post.id, mediaId, !isFreePreview);
      await onUpdate();
    } catch (error) {
      console.error("Failed to toggle free preview:", error);
      toast({
        title: "Failed to toggle free preview",
        variant: "destructive",
      });
    }
  };

  const removeMediaFromPost = async (postMediaId: string) => {
    try {
      await window.api["post:removeMedia"](post.id, [postMediaId]);
      await onUpdate();
      toast({
        title: "Media removed from post",
      });
    } catch (error) {
      console.error("Failed to remove media from post:", error);
      toast({
        title: "Failed to remove media from post",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <MediaSelectionProvider media={post.postMedia.map((pm) => pm.media)}>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1">
          {post.postMedia.map((postMedia, index) => (
            <Tooltip key={postMedia.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="group relative aspect-square cursor-pointer rounded-lg overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-0 z-10 border-2 border-transparent rounded-lg",
                      postMedia.isFreePreview && "border-dashed border-border"
                    )}
                  >
                    <MediaTile
                      media={postMedia.media}
                      index={index}
                      allMedias={post.postMedia.map((pm) => pm.media)}
                      withPreview
                      withDuration
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
                  className="h-7 w-7 text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFreePreview(postMedia.media.id, postMedia.isFreePreview);
                  }}
                >
                  {postMedia.isFreePreview ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
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
                      setConfirmingDelete(null);
                    } else {
                      setConfirmingDelete(postMedia.id);
                    }
                  }}
                  onMouseLeave={() => setConfirmingDelete(null)}
                >
                  <div className="flex items-center gap-1.5">
                    <Trash2Icon size={14} />
                    {confirmingDelete === postMedia.id && <span className="text-xs">Sure?</span>}
                  </div>
                </Button>
              </TooltipContent>
            </Tooltip>
          ))}
          <PostDetailAddMediaButton
            post={post}
            onUpdate={onUpdate}
            isDraggingMedia={isDraggingMedia}
          />
        </div>
      </MediaSelectionProvider>
    </TooltipProvider>
  );
};
