import { Textarea } from "@renderer/components/ui/textarea";
import { useToast } from "@renderer/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Post } from "src/features/posts/entity";
import { HashtagButton } from "../../components/HashtagButton";

type PostDetailCaptionInputProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailCaptionInput = ({ post, onUpdate }: PostDetailCaptionInputProps) => {
  const [caption, setCaption] = useState(post.caption || "");
  const { toast } = useToast();

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

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Add a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="min-h-[200px] pr-10"
        />
        <HashtagButton
          media={post.postMedia.map((pm) => pm.media)}
          channel={post.channel}
          caption={caption}
          onCaptionChange={setCaption}
          className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        />
      </div>
    </div>
  );
};
