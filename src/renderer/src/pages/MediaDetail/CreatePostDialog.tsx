import { ChannelSelect } from "@renderer/components/ChannelSelect";
import { DateTimePicker } from "@renderer/components/DateTimePicker";
import { HashtagButton } from "@renderer/components/HashtagButton";
import { MediaSelection } from "@renderer/components/MediaSelection";
import { MediaTile } from "@renderer/components/MediaTile";
import { StatusSelect } from "@renderer/components/StatusSelect";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Textarea } from "@renderer/components/ui/textarea";
import { useToast } from "@renderer/components/ui/use-toast";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { PostStatus } from "../../../../features/posts/entity";
import { useChannels } from "../../contexts/ChannelContext";

type CreatePostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: Media[];
  initialDate?: Date;
};

export const CreatePostDialog = ({
  open,
  onOpenChange,
  media,
  initialDate,
}: CreatePostDialogProps) => {
  const { toast } = useToast();
  const { channels } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialDate) {
      return new Date(initialDate);
    }
    const now = new Date();
    now.setHours(12);
    now.setMinutes(0);
    return now;
  });
  const [status, setStatus] = useState<PostStatus>("draft");
  const [selectedMedia, setSelectedMedia] = useState<Media[]>(media);
  const [caption, setCaption] = useState("");
  const [isMediaSelectionOpen, setIsMediaSelectionOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedMedia(media);
  }, [open, media]);

  useEffect(() => {
    if (!channels.length || channels.length > 1) return;
    setSelectedChannel([channels[0].id]);
  }, [channels]);

  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  const handleMediaSelect = (mediaItem: Media) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((m) => m.id === mediaItem.id);
      if (isSelected) {
        // Don't allow deselecting the initial media items
        if (media.some((m) => m.id === mediaItem.id)) return prev;
        return prev.filter((m) => m.id !== mediaItem.id);
      } else {
        return [...prev, mediaItem];
      }
    });
  };

  const handleCreatePost = useCallback(async () => {
    if (selectedChannel.length === 0) {
      toast({
        title: "Please select a channel",
        variant: "destructive",
      });
      return;
    }

    try {
      await window.api["post:create"](
        {
          date: selectedDate.toISOString(),
          channelId: selectedChannel[0],
          categoryId: media[0].categories[0]?.id,
          status,
          caption,
        },
        selectedMedia.map((m) => m.id)
      );

      toast({
        title: "Post created successfully",
      });

      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  }, [selectedChannel, selectedDate, status, media, selectedMedia, onOpenChange, toast, caption]);

  return (
    <MediaSelectionProvider media={selectedMedia}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 pl-1">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Channel</label>
                  <ChannelSelect
                    value={selectedChannel}
                    onChange={setSelectedChannel}
                    multiple={false}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Status</label>
                  <StatusSelect value={status} onChange={setStatus} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Date</label>
                  <DateTimePicker date={selectedDate} setDate={setSelectedDate} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Caption</label>
                  <div className="relative">
                    <Textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write your post caption..."
                      className="min-h-[100px] resize-none pr-10"
                    />
                    <HashtagButton
                      media={selectedMedia}
                      caption={caption}
                      onCaptionChange={setCaption}
                      className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Selected Media ({selectedMedia.length})
                </label>
                <ScrollArea className="h-[200px] border rounded-md p-2">
                  <div className="grid grid-cols-3 gap-2">
                    {selectedMedia.map((item, index) => (
                      <div key={item.id} className="relative aspect-square">
                        <MediaTile
                          media={item}
                          allMedias={selectedMedia}
                          index={index}
                          withTier
                          withCategoryHint
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
              <Button
                variant="ghost"
                className="flex items-center gap-2 self-start my-2"
                onClick={() => setIsMediaSelectionOpen(!isMediaSelectionOpen)}
              >
                {isMediaSelectionOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {isMediaSelectionOpen ? "Hide Media Selection" : "Add more media"}
              </Button>

              {isMediaSelectionOpen && (
                <MediaSelection
                  selectedMedia={selectedMedia}
                  onMediaSelect={handleMediaSelect}
                  referenceMedia={media[0]}
                  excludeMediaIds={media.map((m) => m.id)}
                />
              )}
            </div>
          </div>

          <DialogFooter className="border-t py-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>
              Create Post with {selectedMedia.length}{" "}
              {selectedMedia.length === 1 ? "item" : "items"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MediaSelectionProvider>
  );
};
