import { ChannelSelect } from "@renderer/components/ChannelSelect";
import { DateTimePicker } from "@renderer/components/DateTimePicker";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { useToast } from "@renderer/components/ui/use-toast";
import { useCallback, useEffect, useState } from "react";
import { useChannels } from "../../contexts/ChannelContext";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaId: string;
}

export function CreatePostDialog({ open, onOpenChange, mediaId }: CreatePostDialogProps) {
  const { toast } = useToast();

  const { channels } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    if (!channels.length || channels.length > 1) return;
    setSelectedChannel([channels[0].id]);
  }, [channels]);

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
          status: "posted",
          caption: "",
        },
        [mediaId]
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
  }, [selectedChannel, selectedDate, mediaId, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Channel</label>
            <ChannelSelect value={selectedChannel} onChange={setSelectedChannel} multiple={false} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Posted</label>
            <DateTimePicker date={selectedDate} setDate={setSelectedDate} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePost}>Create Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
