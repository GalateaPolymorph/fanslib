import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { StatusSticker } from "@renderer/components/StatusSticker";
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
        "grid [grid-template-areas:'stickers_time''stickers_media'] grid-cols-[auto_1fr]",
        "gap-x-2 gap-y-0.5",
        "border p-2 rounded-md",
        {
          "opacity-50": isVirtualPost(post),
          "hover:bg-muted/50 transition-colors": !isVirtualPost(post),
        }
      )}
    >
      <div className="[grid-area:stickers] flex flex-col gap-1">
        <ChannelBadge noName name={""} typeId={post.channel.type.id} size="sm" />
        {tier && <Sticker className="text-xs w-5">{printTier(tier)}</Sticker>}
        {!isVirtualPost(post) && <StatusSticker status={post.status} variant="inverted" />}
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
