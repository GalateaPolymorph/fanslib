import { useToast } from "@renderer/components/ui/use-toast";
import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
import { useDragOver } from "@renderer/hooks/useDragOver";
import { cn } from "@renderer/lib/utils";
import { CreatePostDialog } from "@renderer/pages/MediaDetail/CreatePostDialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Media } from "src/features/library/entity";
import { Post } from "../../../../../features/posts/entity";
import { isVirtualPost, VirtualPost } from "../../../lib/virtual-posts";

type PostCalendarDropzoneProps = {
  post: Post | VirtualPost;
  children: React.ReactNode;
};

export const PostCalendarDropzone = ({ post, children }: PostCalendarDropzoneProps) => {
  const { isDragging, draggedMedias, endMediaDrag } = useMediaDrag();
  const [createMedia, setCreateMedia] = useState<Media[]>([]);
  const { toast } = useToast();

  const { isOver, dragHandlers } = useDragOver({
    onDrop: async () => {
      if (draggedMedias.length === 0) return;

      if (isVirtualPost(post)) {
        setCreateMedia(draggedMedias);
      } else {
        try {
          const mediaIds = draggedMedias.map((media) => media.id);
          await window.api["post:addMedia"](post.id, mediaIds);
          toast({
            title:
              draggedMedias.length === 1
                ? "Media added to post"
                : `${draggedMedias.length} media items added to post`,
          });
        } catch (error) {
          console.error("Failed to add media to post:", error);
          toast({
            title: "Failed to add media to post",
            variant: "destructive",
          });
        }
      }
      setTimeout(() => {
        endMediaDrag();
      });
    },
  });

  return (
    <>
      <div
        {...dragHandlers}
        className={cn("relative group", {
          "after:absolute after:inset-0 after:rounded-md after:border-2 after:border-dashed after:pointer-events-none":
            isDragging,
          "after:border-primary after:bg-primary/10": isOver && isDragging,
          "after:border-muted after:bg-muted/40": isDragging && !isOver,
        })}
      >
        {children}
        {isDragging && (
          <Plus
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 transition-colors pointer-events-none",
              "text-primary"
            )}
          />
        )}
      </div>
      <CreatePostDialog
        open={createMedia.length > 0}
        onOpenChange={(open) => {
          if (!open) {
            setCreateMedia([]);
          }
        }}
        media={createMedia}
        initialDate={new Date(post.date)}
      />
    </>
  );
};
