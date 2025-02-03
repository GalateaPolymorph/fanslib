import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { StatusBadge } from "@renderer/components/StatusBadge";
import { TierBadge } from "@renderer/components/TierBadge";
import { format } from "date-fns";
import { Post, PostMedia } from "../../../../../features/posts/entity";
import { CategoryBadge } from "../../../components/CategoryBadge";
import { VirtualPost, VirtualPostMedia } from "../../../lib/virtual-posts";

const getUniqueTiers = (postMedia?: PostMedia[] | VirtualPostMedia[]) => {
  if (!postMedia) return [];

  console.log(postMedia);
  const tiers = postMedia
    .map((pm) => pm.media.tier)
    .filter((tier): tier is NonNullable<typeof tier> => !!tier);

  return [...new Map(tiers.map((tier) => [tier.id, tier])).values()];
};

type PostDetailHeadProps = {
  post: Post | VirtualPost;
  isOpen: boolean;
};

export const PostDetailHead = ({ post, isOpen }: PostDetailHeadProps) => {
  const uniqueTiers = getUniqueTiers(post.postMedia);

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <ChannelBadge name={post.channel.name} typeId={post.channel.typeId} />
        {post.category && <CategoryBadge category={post.category} />}
        {!isOpen && <StatusBadge status={post.status} />}
        {!isOpen && uniqueTiers.map((tier) => <TierBadge key={tier.id} tier={tier} size="sm" />)}
        {!isOpen && (
          <span className="text-sm text-muted-foreground">
            {format(new Date(post.date), "eeee, PPP 'at' p")}
          </span>
        )}
      </div>
      <div className="flex items-center"></div>
    </div>
  );
};
