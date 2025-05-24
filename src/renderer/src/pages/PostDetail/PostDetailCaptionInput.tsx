import { Textarea } from "@renderer/components/ui/textarea";
import { useFieldUpdate } from "@renderer/hooks/forms/useFieldUpdate";
import { useState } from "react";
import { Post } from "src/features/posts/entity";
import { HashtagButton } from "../../components/HashtagButton";

type PostDetailCaptionInputProps = {
  post: Post;
};

export const PostDetailCaptionInput = ({ post }: PostDetailCaptionInputProps) => {
  const [localCaption, setLocalCaption] = useState(post.caption || "");

  const { updateField, isUpdating } = useFieldUpdate<string>({
    post,
    fieldName: "caption",
    transform: (value: string) => value.trim() || null,
    debounceMs: 1000,
  });

  const updateCaption = (newCaption: string) => {
    setLocalCaption(newCaption);
    updateField(newCaption);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="post-caption" className="text-sm font-medium">
        Caption
      </label>
      <div className="relative">
        <Textarea
          id="post-caption"
          placeholder="Add a caption..."
          value={localCaption}
          onChange={(e) => updateCaption(e.target.value)}
          className="min-h-[200px] max-h-[400px] pr-10 resize-y"
          disabled={isUpdating}
        />
        <HashtagButton
          media={post.postMedia.map((pm) => pm.media)}
          channel={post.channel}
          caption={localCaption}
          onCaptionChange={updateCaption}
          className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        />
        {isUpdating && (
          <div className="absolute right-2 bottom-2 bg-background p-1 rounded text-xs text-muted-foreground">
            Saving...
          </div>
        )}
      </div>
    </div>
  );
};
