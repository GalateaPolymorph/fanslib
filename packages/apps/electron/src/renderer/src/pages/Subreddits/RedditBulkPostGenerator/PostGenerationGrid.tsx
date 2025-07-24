import { MediaTile } from "@renderer/components/MediaTile";
import { RedgifsURLIndicator } from "@renderer/components/RedgifsURLIndicator";
import { Button } from "@renderer/components/ui/Button";
import { Textarea } from "@renderer/components/ui/Textarea";
import { MediaSelectionProvider } from "@renderer/contexts/MediaSelectionContext";
import { RefreshCw } from "lucide-react";
import { GeneratedPost } from "../../../../../features/reddit-poster/api-type";

// Helper function to format datetime-local input value
const formatDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to parse datetime-local input value
const parseDateTimeLocal = (value: string): Date => {
  return new Date(value);
};

type PostGenerationGridProps = {
  posts: GeneratedPost[];
  onUpdatePost: (index: number, updates: Partial<GeneratedPost>) => void;
  onRegenerateMedia: (index: number) => void;
};

export const PostGenerationGrid = ({
  posts,
  onUpdatePost,
  onRegenerateMedia,
}: PostGenerationGridProps) => {
  return (
    <div className="flex flex-col gap-4 bg-base-300 p-4 rounded-lg h-[80vh] overflow-y-auto">
      {posts.map((post, index) => (
        <PostGenerationCard
          key={index}
          post={post}
          onUpdatePost={(updates) => onUpdatePost(index, updates)}
          onRegenerateMedia={() => onRegenerateMedia(index)}
        />
      ))}
    </div>
  );
};

type PostGenerationCardProps = {
  post: GeneratedPost;
  onUpdatePost: (updates: Partial<GeneratedPost>) => void;
  onRegenerateMedia: () => void;
};

const PostGenerationCard = ({ post, onUpdatePost, onRegenerateMedia }: PostGenerationCardProps) => {
  return (
    <div className="shadow-sm rounded-lg p-4 bg-base-100">
      <div className="grid grid-cols-[1fr_3fr_3fr_auto] gap-4">
        {/* Media Preview */}
        <div className="w-32 h-32 flex-shrink-0">
          <MediaSelectionProvider media={[post.media]}>
            <MediaTile
              withPreview
              media={post.media}
              withDuration
              allMedias={[post.media]}
              index={0}
              className="w-full h-full object-cover rounded"
            />
          </MediaSelectionProvider>
        </div>

        {/* Post Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-xl">r/{post.subreddit.name}</h3>
            {post.subreddit.notes && (
              <p className="text-sm text-gray-500 mt-1">{post.subreddit.notes}</p>
            )}
          </div>

          {/* Media Info */}
          <div className="space-y-1">
            <RedgifsURLIndicator media={post.media} className="text-xs" />
          </div>
        </div>

        {/* Caption Editor and Time Selector */}
        <div className="space-y-2">
          <Textarea
            value={post.caption}
            onChange={(e) => onUpdatePost({ caption: e.target.value })}
            placeholder="Enter caption..."
            className="min-h-[80px] resize-none"
          />

          <div className="space-y-1">
            <input
              type="datetime-local"
              value={formatDateTimeLocal(post.date)}
              onChange={(e) => onUpdatePost({ date: parseDateTimeLocal(e.target.value) })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Regenerate Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={onRegenerateMedia}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            title="Regenerate media"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
