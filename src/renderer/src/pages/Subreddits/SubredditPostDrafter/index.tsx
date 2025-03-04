import { MediaSelection } from "@renderer/components/MediaSelection";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { useChannels } from "@renderer/contexts/ChannelContext";
import { useRedditPost } from "@renderer/contexts/RedditPostContext";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Subreddit } from "src/features/channels/subreddit";
import { SubredditMediaSelectedView } from "./SubredditMediaSelectedView";

type SubredditPostDrafterProps = {
  subreddits: Subreddit[];
};

export const SubredditPostDrafter = ({ subreddits }: SubredditPostDrafterProps) => {
  const { channels } = useChannels();
  const { drafts, updateDraftMedia } = useRedditPost();
  const redditChannel = channels.find((c) => c.type.id === "reddit");

  return (
    <div className="grid grid-cols-1 gap-6">
      {drafts.map((draft) => {
        const subreddit = subreddits.find((s) => s.id === draft.subreddit.id);
        if (!subreddit) return null;

        const subredditHasNoEligibleMediaFilter =
          !subreddit.eligibleMediaFilter || Object.keys(subreddit.eligibleMediaFilter).length === 0;

        const eligibleMediaFilter = {
          ...(subredditHasNoEligibleMediaFilter
            ? (redditChannel?.eligibleMediaFilter ?? {})
            : subreddit.eligibleMediaFilter),
          subredditFilters: [{ subredditId: subreddit.id, posted: false }],
        };

        return (
          <div key={draft.subreddit.id} className="border rounded-lg p-4">
            <div className="flex flex-col gap-2 mb-4">
              <Link
                to={`https://www.reddit.com/r/${subreddit.name}`}
                className="text-lg font-semibold flex items-center gap-2"
                target="_blank"
              >
                r/{subreddit.name} <ExternalLink className="size-4" />
              </Link>
              {subreddit.notes && (
                <p className="text-sm text-muted-foreground">{subreddit.notes}</p>
              )}
            </div>
            {draft.media && <SubredditMediaSelectedView draft={draft} />}
            {!draft.media && (
              <ScrollArea>
                <MediaSelection
                  pageLimit={5}
                  selectedMedia={[]}
                  onMediaSelect={(media) => updateDraftMedia(draft.subreddit.id, media)}
                  eligibleMediaFilter={eligibleMediaFilter}
                  sort={{ field: "random", direction: "ASC" }}
                />
              </ScrollArea>
            )}
          </div>
        );
      })}
    </div>
  );
};
