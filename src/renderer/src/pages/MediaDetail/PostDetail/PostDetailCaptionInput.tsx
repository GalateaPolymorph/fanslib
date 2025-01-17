import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { useToast } from "@renderer/components/ui/use-toast";
import { Hash } from "lucide-react";
import { useEffect, useState } from "react";
import { Post } from "../../../../../features/posts/entity";
import { usePostHashtags } from "./usePostHashtags";
type PostDetailCaptionInputProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailCaptionInput = ({ post, onUpdate }: PostDetailCaptionInputProps) => {
  const [caption, setCaption] = useState(post.caption || "");
  const { toast } = useToast();
  const { collectHashtags } = usePostHashtags(post);

  useEffect(() => {
    setCaption(post.caption || "");
  }, [post.caption]);

  useEffect(() => {
    const saveCaption = async () => {
      try {
        if (caption === post.caption) return;

        await window.api["post:update"](post.id, { caption });
        await onUpdate();
        toast({
          title: "Caption saved",
          duration: 2000,
        });
      } catch (err) {
        toast({
          title: "Failed to save caption",
          variant: "destructive",
        });
        console.error("Failed to save caption:", err);
      }
    };

    const timeoutId = setTimeout(saveCaption, 1000);
    return () => clearTimeout(timeoutId);
  }, [caption, post.id, post.caption, onUpdate, toast]);

  const addHashtags = () => {
    const hashtags = collectHashtags();
    if (hashtags.length === 0) {
      toast({
        title: "No hashtags found",
        description: "Add hashtags to your settings or media tags first",
        variant: "destructive",
      });
      return;
    }

    const hashtagString = hashtags.join(" ");
    const newCaption = caption ? `${caption}\n\n${hashtagString}` : hashtagString;
    setCaption(newCaption);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="min-h-[100px] pr-10"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                onClick={addHashtags}
              >
                <Hash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              Adds the default hashtags and all media tags to the caption
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
