import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { StatusBadge } from "@renderer/components/StatusBadge";
import { format } from "date-fns";
import { Post } from "../../../../../features/posts/entity";
import { CategoryBadge } from "../../../components/CategoryBadge";
import { VirtualPost } from "../../../lib/virtual-posts";

type PostDetailHeadProps = {
  post: Post | VirtualPost;
  isOpen: boolean;
};

export const PostDetailHead = ({ post, isOpen }: PostDetailHeadProps) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <ChannelBadge name={post.channel.name} typeId={post.channel.typeId} />
        <CategoryBadge category={post.category} />
        {!isOpen && <StatusBadge status={post.status} />}
        {!isOpen && (
          <span className="text-sm text-muted-foreground">
            {format(new Date(post.date), "eeee, PPP")}
          </span>
        )}
      </div>
      <div className="flex items-center"></div>
    </div>
  );
};
