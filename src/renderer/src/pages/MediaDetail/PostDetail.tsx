import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { MediaTileLite } from "@renderer/components/MediaTileLite";
import { StatusBadge } from "@renderer/components/StatusBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion";
import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import { useToast } from "@renderer/components/ui/use-toast";
import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { useState } from "react";
import { Post } from "../../../../features/posts/entity";

type PostDetailProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetail = ({ post, onUpdate }: PostDetailProps) => {
  const [caption, setCaption] = useState(post.caption || "");
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMediaId, setHoveredMediaId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMarkAsPosted = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await window.api["post:update"](post.id, { status: "posted" });
      await onUpdate();
    } catch (err) {
      console.error("Failed to mark post as posted:", err);
    }
  };

  const handleSaveCaption = async () => {
    try {
      await window.api["post:update"](post.id, { caption });
      toast({
        title: "Caption saved successfully",
      });
      await onUpdate();
    } catch (err) {
      toast({
        title: "Failed to save caption",
        variant: "destructive",
      });
      console.error("Failed to save caption:", err);
    }
  };

  return (
    <Accordion
      type="single"
      value={isOpen ? "item-1" : ""}
      onValueChange={(value) => setIsOpen(!!value)}
    >
      <AccordionItem value="item-1" className="border rounded-md">
        <div
          className={cn("transition-colors cursor-pointer", !isOpen && "hover:bg-muted/50", "py-2")}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <ChannelBadge name={post.channel.name} typeId={post.channel.typeId} />
              <StatusBadge status={post.status} />
              <span className="text-sm text-muted-foreground">
                {format(new Date(post.date), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {post.status === "draft" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMarkAsPosted}
                  className="text-green-500 hover:text-green-600 hover:bg-green-100"
                >
                  <Check className="size-4" />
                </Button>
              )}
              <AccordionTrigger />
            </div>
          </div>
        </div>
        <AccordionContent className="px-4">
          <div className="space-y-4">
            <div className="grid grid-cols-8 gap-2">
              {post.postMedia.map((postMedia) => (
                <div
                  key={postMedia.id}
                  className="aspect-square"
                  onMouseEnter={() => setHoveredMediaId(postMedia.media.id)}
                  onMouseLeave={() => setHoveredMediaId(null)}
                >
                  <MediaTileLite
                    media={postMedia.media}
                    isActivePreview={hoveredMediaId === postMedia.media.id}
                  />
                </div>
              ))}
            </div>
            <Textarea
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveCaption}>Save Caption</Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
