import { ChannelSelect } from "@renderer/components/ChannelSelect";
import { DateTimePicker } from "@renderer/components/DateTimePicker";
import { MediaTile } from "@renderer/components/MediaTile";
import { StatusSelect } from "@renderer/components/StatusSelect";
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip";
import { useToast } from "@renderer/components/ui/use-toast";
import { useLibrary } from "@renderer/hooks/useLibrary";
import { cn } from "@renderer/lib/utils";
import { Calendar } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { PostStatus } from "../../../../features/posts/entity";
import { useChannels } from "../../contexts/ChannelContext";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: Media;
}

export function CreatePostDialog({ open, onOpenChange, media }: CreatePostDialogProps) {
  const { toast } = useToast();
  const { channels } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [status, setStatus] = useState<PostStatus>("draft");
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([media]);

  const { media: libraryMedia, isLoading } = useLibrary({
    page: 1,
    limit: 50,
    categories: media.categories.map((cat) => cat.id),
  });

  useEffect(() => {
    if (!channels.length || channels.length > 1) return;
    setSelectedChannel([channels[0].id]);
  }, [channels]);

  useEffect(() => {
    if (open) {
      setSelectedMedia([media]);
    }
  }, [open, media]);

  const toggleMediaSelection = (mediaItem: Media) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((m) => m.id === mediaItem.id);
      if (isSelected) {
        // Don't allow deselecting the initial media
        if (mediaItem.id === media.id) return prev;
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
          categoryId: media.categories[0]?.id,
          status,
          caption: "",
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
  }, [selectedChannel, selectedDate, status, media, selectedMedia, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Channel</label>
                <ChannelSelect
                  value={selectedChannel}
                  onChange={setSelectedChannel}
                  multiple={false}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <StatusSelect value={status} onChange={setStatus} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <DateTimePicker date={selectedDate} setDate={setSelectedDate} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Media ({selectedMedia.length})</label>
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <div className="grid grid-cols-3 gap-2">
                  {selectedMedia.map((item) => (
                    <div key={item.id} className="relative aspect-square">
                      <MediaTile media={item} isActivePreview={false} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0 border-t mt-4">
            <div className="flex justify-between items-center py-4">
              <label className="text-sm font-medium">Add More Media</label>
              <span className="text-xs text-muted-foreground">
                {isLoading ? "Loading..." : `${libraryMedia.length} items available`}
              </span>
            </div>
            <ScrollArea className="h-[calc(100%-4rem)] border rounded-md">
              <div className="p-4">
                <div className="grid grid-cols-4 lg:grid-cols-5 gap-4">
                  {libraryMedia.map((item) => {
                    const posts = item.postMedia.map((pm) => pm.post) || [];
                    const isScheduled = posts.some((post) => post.status === "scheduled");
                    const isPosted = posts.some((post) => post.status === "posted");

                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleMediaSelection(item)}
                            className={cn(
                              "relative rounded-md cursor-pointer",
                              selectedMedia.some((m) => m.id === item.id)
                                ? "ring-2 ring-primary"
                                : "hover:ring-2 hover:ring-primary/50",
                              item.id === media.id && "pointer-events-none opacity-50"
                            )}
                          >
                            <div className="aspect-square">
                              <MediaTile media={item} />
                            </div>
                            {(isScheduled || isPosted) && (
                              <div className="absolute top-2 right-2 flex gap-1">
                                {isScheduled && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-orange-500/20 text-orange-500"
                                  >
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Scheduled
                                  </Badge>
                                )}
                                {isPosted && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-500/20 text-green-500"
                                  >
                                    Posted
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Click to{" "}
                            {selectedMedia.some((m) => m.id === item.id) ? "remove" : "add"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="border-t py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePost}>
            Create Post with {selectedMedia.length} {selectedMedia.length === 1 ? "item" : "items"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
