import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { Sticker } from "@renderer/components/ui/sticker";
import { maximumTier, printTier } from "@renderer/lib/tier";
import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Post } from "../../../../../features/posts/entity";
import { isVirtualPost, VirtualPost } from "../../../lib/virtual-posts";
import { PostCalendarDropzone } from "./PostCalendarDropzone";
import { PostCalendarPostMedia } from "./PostCalendarPostMedia";

type PostCalendarPostProps = {
  post: Post | VirtualPost;
  onUpdate?: () => Promise<void>;
};

export const PostCalendarPost = ({ post }: PostCalendarPostProps) => {
  const time = format(new Date(post.date), "h:mm a");
  const tier = maximumTier(post);

  const content = (
    <div
      className={cn(
        "grid [grid-template-areas:'stickers_time''media_media'] grid-cols-[auto_1fr] transition-colors",
        "gap-x-2 gap-y-2",
        "p-3 rounded-md",
        {
          "bg-green-200/50": post.status === "posted",
          "bg-blue-200/50": post.status === "scheduled",
          "bg-gray-200/50": post.status === "draft",
        }
      )}
    >
      <div className="[grid-area:stickers] flex gap-1">
        <ChannelBadge noName name={""} typeId={post.channel.type.id} size="sm" />
        {tier && <Sticker className="text-xs w-5">{printTier(tier)}</Sticker>}
      </div>
      <div className="[grid-area:time] text-xs text-muted-foreground">{time}</div>
      <div className="[grid-area:media] relative">
        <PostCalendarPostMedia postMedia={post.postMedia} isVirtual={isVirtualPost(post)} />
      </div>
    </div>
  );

  return (
    <PostCalendarDropzone post={post}>
      {isVirtualPost(post) ? (
        content
      ) : (
        <Link to={`/posts/${post.id}`} className="block">
          {content}
        </Link>
      )}
    </PostCalendarDropzone>
  );
};
