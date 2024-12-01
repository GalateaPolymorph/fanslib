import { useSettings } from "@renderer/contexts/SettingsContext";
import { cn } from "@renderer/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Loader2, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Media } from "../../../lib/database/media/type";
import { Post } from "../../../lib/database/posts/type";
import { MediaDisplay } from "./MediaDisplay";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface MediaSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId?: string;
  onSelect: (media: Media[]) => void;
  initialSelectedMedia?: Media[];
}

export function MediaSelectDialog({
  open,
  onOpenChange,
  categoryId,
  onSelect,
  initialSelectedMedia = [],
}: MediaSelectDialogProps) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<Media[]>(initialSelectedMedia);
  const [mediaPostsMap, setMediaPostsMap] = useState<Record<string, Post[]>>({});

  // Load media when dialog opens
  const loadMedia = async () => {
    if (!settings?.libraryPath) {
      setMediaItems([]);
      return;
    }

    try {
      setLoading(true);
      const allMedia = await window.api.library.getAllMedia();
      const filteredMedia = categoryId
        ? allMedia.filter((media) => media.categoryIds?.includes(categoryId))
        : allMedia;

      setMediaItems(filteredMedia);

      // Load post information for each media
      const postsMap: Record<string, Post[]> = {};
      await Promise.all(
        filteredMedia.map(async (media) => {
          const posts = await window.api.posts.getByMediaPath(media.path);
          if (posts.length > 0) {
            postsMap[media.path] = posts;
          }
        })
      );
      setMediaPostsMap(postsMap);
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle media selection
  const toggleMediaSelection = (mediaItem: Media) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((m) => m.path === mediaItem.path);
      if (isSelected) {
        return prev.filter((m) => m.path !== mediaItem.path);
      } else {
        return [...prev, mediaItem];
      }
    });
  };

  // Handle save
  const handleSave = () => {
    onSelect(selectedMedia);
    onOpenChange(false);
  };

  useEffect(() => {
    loadMedia();
  }, [settings?.libraryPath]);

  // Render no library path state
  if (!settings?.libraryPath) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Library Path Set</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-center text-muted-foreground">
              Please configure your library path in settings to view and select media.
            </p>
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate("/settings");
              }}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Go to Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          loadMedia();
          setSelectedMedia(initialSelectedMedia);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">No media found in your library.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-3 gap-4 p-4">
                {mediaItems.map((mediaItem) => {
                  const posts = mediaPostsMap[mediaItem.path] || [];
                  const isScheduled = posts.some((post) => post.status === "scheduled");
                  const isPosted = posts.some((post) => post.status === "posted");

                  return (
                    <Tooltip key={mediaItem.path}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => toggleMediaSelection(mediaItem)}
                          className={cn(
                            "relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer group",
                            selectedMedia.some((m) => m.path === mediaItem.path)
                              ? "border-primary"
                              : "border-transparent hover:border-primary/50"
                          )}
                        >
                          <MediaDisplay media={mediaItem} />
                          {(isScheduled || isPosted) && (
                            <div className="absolute top-2 right-2 flex gap-1">
                              {isScheduled && (
                                <Badge
                                  variant="secondary"
                                  className="bg-orange-500/20 text-orange-500 whitespace-nowrap"
                                >
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Scheduled
                                </Badge>
                              )}
                              {isPosted && (
                                <Badge
                                  variant="secondary"
                                  className="bg-green-500/20 text-green-500 whitespace-nowrap"
                                >
                                  Posted
                                </Badge>
                              )}
                            </div>
                          )}
                        </button>
                      </TooltipTrigger>
                      {posts.length > 0 && (
                        <TooltipContent className="bg-popover text-popover-foreground border">
                          <div className="space-y-2">
                            <p className="font-medium">
                              Used in {posts.length} post{posts.length > 1 ? "s" : ""}
                            </p>
                            {posts.map((post) => (
                              <div key={post.id} className="text-sm">
                                <p className="text-muted-foreground">
                                  {post.status === "scheduled"
                                    ? `Scheduled for ${format(new Date(post.scheduledDate), "MMM d, h:mm a")}`
                                    : `Posted ${formatDistanceToNow(new Date(post.scheduledDate))} ago`}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
