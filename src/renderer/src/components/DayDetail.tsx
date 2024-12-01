import { format } from "date-fns";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CHANNEL_TYPES } from "../../../lib/database/channels/channelTypes";
import { Post } from "../../../lib/database/posts/type";
import { cn } from "../lib/utils";
import { ChannelTypeIcon } from "./ChannelTypeIcon";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface DayDetailProps {
  date: Date;
  posts: Post[];
  onClose: () => void;
}

export const DayDetail = ({ date, posts, onClose }: DayDetailProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-lg font-semibold">{format(date, "MMMM d, yyyy")}</h2>
          <p className="text-sm text-muted-foreground">{posts.length} posts</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4 w-full">
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              {/* Channel and Category */}
              <div className="flex items-center justify-between mb-2">
                {post.channel && (
                  <div
                    className="flex items-center gap-2 px-2 py-1 rounded-md"
                    style={{
                      backgroundColor:
                        CHANNEL_TYPES[post.channel.type.id as keyof typeof CHANNEL_TYPES]?.color +
                        "20",
                    }}
                  >
                    <ChannelTypeIcon
                      typeId={post.channel.type.id as keyof typeof CHANNEL_TYPES}
                      className="w-4 h-4"
                      color={
                        CHANNEL_TYPES[post.channel.type.id as keyof typeof CHANNEL_TYPES]?.color
                      }
                    />
                    <span className="text-sm font-medium">{post.channel.name}</span>
                  </div>
                )}
                {post.category && (
                  <div
                    className="px-2 py-1 rounded-md text-sm font-medium"
                    style={{
                      backgroundColor: post.category.color + "20",
                      color: post.category.color,
                    }}
                  >
                    {post.category.name}
                  </div>
                )}
              </div>

              {/* Time */}
              <p className="text-sm text-muted-foreground mb-2">
                {format(new Date(post.scheduledDate), "p")}
              </p>

              {/* Caption */}
              <p className="text-sm line-clamp-3">{post.caption}</p>

              {/* Media Preview */}
              {post.media.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {post.media.slice(0, 4).map((media, index) => (
                    <div
                      key={media.path}
                      className={cn(
                        "aspect-square rounded-md overflow-hidden bg-muted",
                        post.media.length === 3 && index === 2 && "col-span-2"
                      )}
                    >
                      <img
                        src={`file://${media.path}`}
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
