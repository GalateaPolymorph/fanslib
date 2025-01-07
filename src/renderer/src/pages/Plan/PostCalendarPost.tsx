import { format } from "date-fns";
import { AlertCircle, Check, Clock, PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { CHANNEL_TYPES } from "../../../../features/channels/channelTypes";
import { Post, PostStatus } from "../../../../features/posts/entity";
import { ChannelTypeIcon } from "../../components/ChannelTypeIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { cn } from "../../lib/utils";

const statusIcon = {
  draft: <PenLine className="h-3 w-3" />,
  scheduled: <Clock className="h-3 w-3" />,
  posted: <Check className="h-3 w-3" />,
} as const;

const statusColor = {
  draft: "text-yellow-400",
  scheduled: "text-blue-400",
  posted: "text-green-400",
} as const;

type PostCalendarPostStatusProps = {
  status: PostStatus;
};

const PostCalendarPostStatus = ({ status }: PostCalendarPostStatusProps) => (
  <div className="absolute top-1 right-1">
    <div className={cn("h-5 w-5 flex items-center justify-center", statusColor[status])}>
      {statusIcon[status]}
    </div>
  </div>
);

interface PostCalendarPostProps {
  post: Post;
}

export const PostCalendarPost = ({ post }: PostCalendarPostProps) => {
  const firstMediaId = post.postMedia[0]?.media.id;

  if (!firstMediaId) {
    return null;
  }

  return (
    <Link
      to={`/content/${firstMediaId}`}
      className="relative block px-2 py-1.5 mx-1 mb-1 text-xs rounded bg-accent/50 cursor-pointer"
    >
      <PostCalendarPostStatus status={post.status} />
      <div className="font-medium flex items-center">
        <div className="flex items-center gap-1">
          {format(new Date(post.date), "h:mm a")}
          <span
            className={cn(
              "px-1 py-0.5 rounded-sm text-[10px] capitalize",
              post.status === "draft" && "bg-yellow-500/20 text-yellow-700",
              post.status === "scheduled" && "bg-blue-500/20 text-blue-700",
              post.status === "posted" && "bg-green-500/20 text-green-700"
            )}
          >
            {post.status}
          </span>
        </div>
      </div>
      {(!post.postMedia || post.postMedia.length === 0) && (
        <Tooltip>
          <TooltipTrigger>
            <AlertCircle className="w-3 h-3 text-destructive" />
          </TooltipTrigger>
          <TooltipContent>
            <p>No media assigned</p>
          </TooltipContent>
        </Tooltip>
      )}
      <div className="flex flex-wrap items-center gap-1 mt-1">
        {post.channel && (
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-sm text-white"
            style={{
              backgroundColor:
                CHANNEL_TYPES[post.channel.type.id as keyof typeof CHANNEL_TYPES]?.color,
            }}
          >
            <ChannelTypeIcon
              color="white"
              typeId={post.channel.type.id as keyof typeof CHANNEL_TYPES}
              className="w-3 h-3 text-white"
            />
            <span>{post.channel.name}</span>
          </div>
        )}
        {post.category && (
          <div
            className="px-1.5 py-0.5 text-[10px] rounded-sm text-white"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </div>
        )}
      </div>
    </Link>
  );
};
