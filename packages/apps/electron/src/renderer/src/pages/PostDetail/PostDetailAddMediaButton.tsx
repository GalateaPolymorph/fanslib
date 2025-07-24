import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MediaSelection } from "@renderer/components/MediaSelection";
import { Button } from "@renderer/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/Dialog";
import { useAddMediaToPost } from "@renderer/hooks/api/usePost";
import { cn } from "@renderer/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Media } from "src/features/library/entity";
import { Post } from "src/features/posts/entity";
import { MediaTileLite } from "../../components/MediaTile";

type PostDetailAddMediaButtonProps = {
  post: Post;
  isDraggingMedia?: boolean;
  variant?: "default" | "detail";
};

export const PostDetailAddMediaButton = ({
  post,
  isDraggingMedia = false,
  variant = "default",
}: PostDetailAddMediaButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const addMediaMutation = useAddMediaToPost();

  const updateDialogOpen = async (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedMedia([]);
    }
  };

  const toggleMediaSelection = (media: Media) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((m) => m.id === media.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== media.id);
      }
      return [...prev, media];
    });
  };

  const addMediaToPost = async () => {
    try {
      await addMediaMutation.mutateAsync({
        postId: post.id,
        mediaIds: selectedMedia.map((m) => m.id),
      });
      setOpen(false);
      setSelectedMedia([]);
    } catch (error) {
      console.error("Failed to add media to post:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={updateDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-1 transition-all duration-200",
            variant === "detail" && "h-10 px-4",
            isDraggingMedia
              ? "border-primary border-2 border-dashed bg-primary/10 text-primary hover:bg-primary/20"
              : "hover:bg-muted"
          )}
        >
          <Plus size={16} />
          {variant === "detail" ? "Add Media" : ""}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl h-[80vh] flex flex-col min-h-0 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Media to Post</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1">
          <div className="space-y-2">
            <ScrollArea className="border rounded-md p-2">
              <div className="grid grid-cols-5 min-h-[160px] gap-2">
                {selectedMedia.map((item) => (
                  <div key={item.id} className="relative aspect-square">
                    <MediaTileLite media={item} isActivePreview={false} />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <MediaSelection
            selectedMedia={selectedMedia}
            onMediaSelect={toggleMediaSelection}
            className="mt-4"
            referenceMedia={post.postMedia[0]?.media}
            excludeMediaIds={post.postMedia.map((pm) => pm.media.id)}
            eligibleMediaFilter={
              post.subreddit?.eligibleMediaFilter ?? post.channel?.eligibleMediaFilter
            }
          />

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={addMediaToPost}
              disabled={selectedMedia.length === 0 || addMediaMutation.isPending}
            >
              {addMediaMutation.isPending
                ? "Adding..."
                : `Add ${selectedMedia.length} ${selectedMedia.length === 1 ? "item" : "items"}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
