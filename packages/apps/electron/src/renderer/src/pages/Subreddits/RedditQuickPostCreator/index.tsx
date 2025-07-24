import { Subreddit } from "../../../../../features/channels/subreddit";
import { CaptionSection } from "./CaptionSection";
import { MediaSection } from "./MediaSection";
import { PostActionSection } from "./PostActionSection";
import { RedditQuickPostProvider } from "./RedditQuickPostContext";
import { SubredditSection } from "./SubredditSection";

type RedditQuickPostCreatorProps = {
  subreddits: Subreddit[];
};

const RedditQuickPostCreatorContent = () => {
  return (
    <div className="p-8">
      <div className="flex gap-8">
        <div className="flex-1 space-y-4">
          <div className="space-y-4">
            <SubredditSection />
          </div>

          <div className="space-y-4">
            <MediaSection />
          </div>

          <div className="space-y-4">
            <CaptionSection />
          </div>
        </div>

        <PostActionSection />
      </div>
    </div>
  );
};

export const RedditQuickPostCreator = ({ subreddits }: RedditQuickPostCreatorProps) => {
  return (
    <RedditQuickPostProvider subreddits={subreddits}>
      <RedditQuickPostCreatorContent />
    </RedditQuickPostProvider>
  );
};
