import { cn } from "@renderer/lib/utils";
import { isVirtualPost, VirtualPost } from "@renderer/lib/virtual-posts";
import { PostTimelineDropZone } from "@renderer/pages/Plan/PostTimelineDropZone";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Post } from "../../../../features/posts/entity";
import { ChannelBadge } from "../ChannelBadge";
import { MediaTile } from "../MediaTile";
import { StatusSticker } from "../StatusSticker";
import { usePostPreviewDrag } from "./usePostPreviewDrag";

type PostPreviewProps = {
  post: Post | VirtualPost;
  onUpdate: () => Promise<void>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  previousPostInList?: Post | VirtualPost;
};

export const PostPreview = ({
  post,
  onUpdate,
  isOpen,
  onOpenChange,
  previousPostInList,
}: PostPreviewProps) => {
  const {
    isDragging,
    isDraggedOver,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = usePostPreviewDrag({
    post,
    isOpen,
    onOpenChange,
    onUpdate,
  });

  const previousDropZone =
    !isDraggedOver || !previousPostInList ? null : (
      <PostTimelineDropZone previousPostDate={new Date(previousPostInList.date)} />
    );
  const nextDropZone = !isDraggedOver ? null : (
    <PostTimelineDropZone previousPostDate={new Date(post.date)} />
  );

  return (
    <Link
      to={isVirtualPost(post) ? `#` : `/posts/${post.id}`}
      className="flex flex-col flex-1 min-h-0"
    >
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previousDropZone}
        <div
          className={cn(
            "border rounded-md relative group transition-colors",
            isVirtualPost(post) && "opacity-60",
            isDragging &&
              isDraggedOver &&
              "border-2 border-dashed border-purple-500 bg-purple-50/50 opacity-100"
          )}
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ChannelBadge name={post.channel.name} typeId={post.channel.typeId} />
                <StatusSticker status={post.status} />
              </div>
              <span className="text-sm text-muted-foreground block">
                {format(new Date(post.date), "MMMM d, h:mm aaa")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {post.postMedia.map((pm) => (
                <MediaTile
                  key={pm.id}
                  media={pm.media}
                  allMedias={post.postMedia.map((pm) => pm.media)}
                  index={post.postMedia.indexOf(pm)}
                  className="size-24"
                />
              ))}
            </div>
          </div>
          {isDragging && isDraggedOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-50/50">
              <Plus className="w-6 h-6 text-purple-500" />
            </div>
          )}
        </div>
        {nextDropZone}
      </div>
    </Link>
  );
};
