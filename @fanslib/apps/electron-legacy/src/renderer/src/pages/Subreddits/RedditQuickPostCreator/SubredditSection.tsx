import { Button } from "@renderer/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useRedditQuickPostContext } from "./RedditQuickPostContext";

export const SubredditSection = () => {
  const { postState, generateRandomPost, lastPostDates } = useRedditQuickPostContext();

  const { subreddit, isLoading } = postState;
  const lastPostDate = subreddit ? lastPostDates[subreddit.id] : undefined;

  if (!subreddit) {
    return (
      <div className="p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-600">
            {isLoading ? "Generating post..." : "Selecting optimal subreddit..."}
          </p>
          <Button
            onClick={generateRandomPost}
            variant="ghost"
            size="lg"
            disabled={isLoading}
            className="flex items-center gap-3 px-6 py-3 text-base font-medium"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <a
            href={`https://reddit.com/r/${subreddit.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors"
          >
            r/{subreddit.name}
            <ExternalLink className="h-5 w-5" />
          </a>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {subreddit.notes && <span title={subreddit.notes}>{subreddit.notes}</span>}
            {lastPostDate && (
              <span>
                Last post:{" "}
                {formatDistanceToNow(new Date(lastPostDate), {
                  addSuffix: true,
                })}
              </span>
            )}
            {!subreddit.notes && !lastPostDate && <span>No previous posts</span>}
          </div>
        </div>
        <Button
          onClick={generateRandomPost}
          variant="ghost"
          size="lg"
          disabled={isLoading}
          className="flex items-center gap-3 px-6 py-3 text-base font-medium"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
