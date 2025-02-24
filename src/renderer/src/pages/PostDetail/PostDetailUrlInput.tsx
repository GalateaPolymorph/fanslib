import { Input } from "@renderer/components/ui/input";
import { useToast } from "@renderer/components/ui/use-toast";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { useEffect, useState } from "react";
import { Post } from "src/features/posts/entity";

type PostDetailUrlInputProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailUrlInput = ({ post, onUpdate }: PostDetailUrlInputProps) => {
  const [url, setUrl] = useState(post.url ?? "");
  const debouncedUrl = useDebounce(url, 500);
  const { toast } = useToast();

  useEffect(() => {
    setUrl(post.url ?? "");
  }, [post.url]);

  useEffect(() => {
    const updateUrl = async () => {
      // Convert empty string to null for comparison
      const normalizedDebouncedUrl = debouncedUrl.trim() || null;
      const normalizedPostUrl = post.url?.trim() || null;

      // Skip update if values are effectively the same
      if (normalizedDebouncedUrl === normalizedPostUrl) {
        return;
      }

      try {
        await window.api["post:update"](post.id, { url: normalizedDebouncedUrl });
        await onUpdate();

        toast({
          title: "Post URL updated",
          duration: 2000,
        });
      } catch (err) {
        toast({
          title: "Failed to update post URL",
          variant: "destructive",
        });
        console.error("Failed to update post URL:", err);
        // Reset to the original value on error
        setUrl(post.url ?? "");
      }
    };

    // Only run the update if we have a debounced value
    if (debouncedUrl !== undefined) {
      updateUrl();
    }
  }, [debouncedUrl, post.id, post.url, onUpdate, toast]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="post-url" className="text-sm font-medium">
        Post URL
      </label>
      <Input
        id="post-url"
        type="url"
        placeholder="Enter post URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </div>
  );
};
