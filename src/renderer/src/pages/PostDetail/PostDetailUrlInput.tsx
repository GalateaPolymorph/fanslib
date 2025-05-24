import { Input } from "@renderer/components/ui/input";
import { useFieldUpdate } from "@renderer/hooks/forms/useFieldUpdate";
import { useState } from "react";
import { Post } from "src/features/posts/entity";

type PostDetailUrlInputProps = {
  post: Post;
};

export const PostDetailUrlInput = ({ post }: PostDetailUrlInputProps) => {
  const [localUrl, setLocalUrl] = useState(post.url ?? "");

  const { updateField, isUpdating } = useFieldUpdate<string>({
    post,
    fieldName: "url",
    transform: (value: string) => value.trim() || null,
  });

  const updateUrl = (newUrl: string) => {
    setLocalUrl(newUrl);
    updateField(newUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="post-url" className="text-sm font-medium">
        Post URL
      </label>
      <div className="relative">
        <Input
          id="post-url"
          type="url"
          placeholder="Enter post URL"
          value={localUrl}
          onChange={(e) => updateUrl(e.target.value)}
          disabled={isUpdating}
        />
        {isUpdating && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="text-xs text-muted-foreground">Updating...</div>
          </div>
        )}
      </div>
    </div>
  );
};
