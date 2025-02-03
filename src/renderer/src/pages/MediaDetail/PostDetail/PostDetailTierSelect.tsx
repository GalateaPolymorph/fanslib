import { TierSelect } from "@renderer/components/TierSelect";
import { useToast } from "@renderer/components/ui/use-toast";
import { Post } from "../../../../../features/posts/entity";

type PostDetailTierSelectProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailTierSelect = ({ post, onUpdate }: PostDetailTierSelectProps) => {
  const { toast } = useToast();

  const updateTier = async (tierId: number | null) => {
    try {
      await window.api["post:update"](post.id, { tierId: tierId ?? undefined });
      await onUpdate();
      toast({
        title: "Post tier updated",
      });
    } catch (error) {
      toast({
        title: "Failed to update post tier",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <TierSelect
      selectedTierIds={post.tierId ? [post.tierId] : []}
      onTierSelect={(ids) => updateTier(ids[0] ?? null)}
      includeNoneOption
    />
  );
};
