import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MediaSelection } from "@renderer/components/MediaSelection";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { useToast } from "@renderer/components/ui/use-toast";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Media } from "../../../../../features/library/entity";
import { Post } from "../../../../../features/posts/entity";
import { MediaTileLite } from "../../../components/MediaTileLite";

type PostDetailAddMediaButtonProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailAddMediaButton = ({ post, onUpdate }: PostDetailAddMediaButtonProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);

  const handleOpenChange = async (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedMedia([]);
    }
  };

  const handleMediaSelect = (media: Media) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((m) => m.id === media.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== media.id);
      }
      return [...prev, media];
    });
  };

  const handleAddMedia = async () => {
    try {
      await window.api["post:addMedia"](
        post.id,
        selectedMedia.map((m) => m.id)
      );
      await onUpdate();
      setOpen(false);
      toast({
        title: "Media added to post",
      });
    } catch (error) {
      console.error("Failed to add media to post:", error);
      toast({
        title: "Failed to add media to post",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="relative aspect-square cursor-pointer rounded-lg overflow-hidden">
          <div className="absolute inset-0 z-10 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
            <Plus className="size-6 text-border" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Media to Post</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
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
            onMediaSelect={handleMediaSelect}
            className="mt-4"
            referenceMedia={post.postMedia[0]?.media}
            excludeMediaIds={post.postMedia.map((pm) => pm.media.id)}
          />

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedia} disabled={selectedMedia.length === 0}>
              Add {selectedMedia.length} {selectedMedia.length === 1 ? "item" : "items"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
