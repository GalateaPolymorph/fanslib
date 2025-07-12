import { Button } from "@renderer/components/ui/Button";
import { Textarea } from "@renderer/components/ui/Textarea";
import { useFieldUpdate } from "@renderer/hooks/forms/useFieldUpdate";
import { useClipboard } from "@renderer/hooks/ui/useClipboard";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Post } from "src/features/posts/entity";
import { HashtagButton } from "../../components/HashtagButton";

type PostDetailCaptionInputProps = {
  post: Post;
};

export const PostDetailCaptionInput = ({ post }: PostDetailCaptionInputProps) => {
  const [localCaption, setLocalCaption] = useState(post.caption || "");
  const { copyToClipboard, isCopied } = useClipboard();

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

  const copyCurrentCaption = () => {
    copyToClipboard(localCaption);
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex items-center justify-between">
        <label htmlFor="post-caption" className="text-sm font-medium">
          Caption
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyCurrentCaption}
          disabled={!localCaption.trim()}
          className="h-6 px-2 text-xs"
        >
          {isCopied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
            </>
          )}
        </Button>
      </div>
      <div className="relative">
        <Textarea
          id="post-caption"
          placeholder="Add a caption..."
          value={localCaption}
          onChange={(e) => updateCaption(e.target.value)}
          className="min-h-[200px] max-h-[400px] pr-10 resize-y"
        />
        <HashtagButton
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
