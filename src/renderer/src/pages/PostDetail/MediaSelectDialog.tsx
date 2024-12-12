import { DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Media } from "../../../../features/library/entity";
import { MediaTile } from "../../components/MediaTile";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Dialog, DialogHeader } from "../../components/ui/dialog";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { useLibrary } from "../../hooks/useLibrary";
import { cn } from "../../lib/utils";

type MediaSelectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: Media[]) => void;
  initialSelectedMedia?: Media[];
  categoryId?: string;
};

export const MediaSelectDialog = ({
  open,
  onOpenChange,
  onSelect,
  initialSelectedMedia = [],
  categoryId,
}: MediaSelectDialogProps) => {
  const [selectedMedia, setSelectedMedia] = useState<Media[]>(initialSelectedMedia);

  const { media, isLoading } = useLibrary({
    page: 1,
    limit: 50,
    categories: [categoryId],
  });

  useEffect(() => {
    if (open) {
      setSelectedMedia(initialSelectedMedia);
    }
  }, [open, initialSelectedMedia]);

  const toggleMediaSelection = (mediaItem: Media) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((m) => m.id === mediaItem.id);
      if (isSelected) {
        return prev.filter((m) => m.id !== mediaItem.id);
      } else {
        return [...prev, mediaItem];
      }
    });
  };

  const handleSave = () => {
    onSelect(selectedMedia);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
          <DialogDescription>Choose media to add to your post</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {media.map((item) => {
              const posts = item.postMedia.map((pm) => pm.post) || [];
              const isScheduled = posts.some((post) => post.status === "scheduled");
              const isPosted = posts.some((post) => post.status === "posted");

              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "p-0 h-auto aspect-square overflow-hidden relative",
                        selectedMedia.some((m) => m.id === item.id)
                          ? "ring-2 ring-primary"
                          : "hover:ring-2 hover:ring-primary/50"
                      )}
                      onClick={() => toggleMediaSelection(item)}
                    >
                      <MediaTile media={item} preview />
                      {(isScheduled || isPosted) && (
                        <div className="absolute top-2 right-2 flex gap-1">
                          {isScheduled && (
                            <Badge variant="secondary" className="bg-orange-500/20 text-orange-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              Scheduled
                            </Badge>
                          )}
                          {isPosted && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                              Posted
                            </Badge>
                          )}
                        </div>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {posts.length > 0 && (
                    <TooltipContent>
                      <div className="space-y-2">
                        <p className="font-medium">
                          Used in {posts.length} post{posts.length > 1 ? "s" : ""}
                        </p>
                        {posts.map((post) => (
                          <div key={post.id} className="text-sm">
                            <p className="text-muted-foreground">
                              {post.status === "scheduled"
                                ? `Scheduled for ${format(new Date(post.date), "MMM d, h:mm a")}`
                                : `Posted ${formatDistanceToNow(new Date(post.date))} ago`}
                              {post.channel && ` • ${post.channel.name}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
            {media.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No media found
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={selectedMedia.length === 0}>
            Assign {selectedMedia.length} media
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
