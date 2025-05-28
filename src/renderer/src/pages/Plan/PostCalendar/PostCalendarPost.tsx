import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { usePlanPreferences } from "@renderer/contexts/PlanPreferencesContext";
import { usePostDrag } from "@renderer/contexts/PostDragContext";
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

export const PostCalendarPost = ({ post, onUpdate }: PostCalendarPostProps) => {
  const { startPostDrag, endPostDrag } = usePostDrag();
  const time = format(new Date(post.date), "h:mm a");
  const { preferences } = usePlanPreferences();

  const dragProps = !isVirtualPost(post)
    ? {
        draggable: true,
        onDragStart: (e: React.DragEvent<HTMLDivElement>) => startPostDrag(e, post),
        onDragEnd: endPostDrag,
      }
    : {};

  const content = (
    <div
      {...dragProps}
      className={cn(
        "grid align-start [grid-template-areas:'stickers_time''media_media''captions_captions'] grid-cols-[auto_1fr] transition-colors",
        "gap-x-2 gap-y-2",
        "p-3 rounded-md border-1 border-muted border-b-3 shadow-sm hover:shadow-lg transition-all hover:scale-101",
        {
          "border-b-green-400": post.status === "posted",
          "border-b-blue-400": post.status === "scheduled",
          "border-b-gray-400": post.status === "draft",
          "cursor-grab active:cursor-grabbing": !isVirtualPost(post),
        },
        {
          "min-h-24 grid-rows-[auto_1fr]": !preferences.view.showCaptions,
          "min-h-48 grid-rows-[auto_1.5fr_1fr]": preferences.view.showCaptions,
        }
      )}
    >
      <div className="[grid-area:stickers] flex gap-1">
        <ChannelBadge
          noName
          name={""}
          typeId={post.channel.type?.id || post.channel.typeId}
          size="sm"
        />
      </div>
      <div className="[grid-area:time] text-xs text-muted-foreground">{time}</div>
      <div className="[grid-area:media] relative">
        <PostCalendarPostMedia postMedia={post.postMedia} isVirtual={isVirtualPost(post)} />
      </div>
      {preferences.view.showCaptions && (
        <div className="[grid-area:captions] text-xs text-muted-foreground">
          {post.caption?.slice(0, 50)}
          {post.caption?.length > 50 && "..."}
        </div>
      )}
    </div>
  );

  return (
    <PostCalendarDropzone post={post} onUpdate={onUpdate}>
      {isVirtualPost(post) ? (
        content
      ) : (
        <Link to={`/posts/${post.id}`} className="block" draggable={false}>
          {content}
        </Link>
      )}
    </PostCalendarDropzone>
  );
};
