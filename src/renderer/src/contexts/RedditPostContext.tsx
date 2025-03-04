import { useToast } from "@renderer/components/ui/use-toast";
import { createContext, ReactNode, useContext, useState } from "react";
import { Media } from "src/features/library/entity";
import { CHANNEL_TYPES } from "../../../features/channels/channelTypes";
import { Subreddit } from "../../../features/channels/subreddit";
import { useChannels } from "./ChannelContext";

export type SubredditPostDraft = {
  subreddit: Subreddit;
  media?: Media | null;
  url?: string;
  caption?: string;
  postId?: string;
};

type RedditPostContextType = {
  drafts: SubredditPostDraft[];
  updateSelectedSubreddits: (selectedIds: string[], subreddits: Subreddit[]) => void;
  updateDraftMedia: (subredditId: string, media: Media | null) => void;
  updateDraftUrl: (subredditId: string, url: string) => void;
  updateDraftCaption: (subredditId: string, caption: string) => void;
  postDraft: (subredditId: string) => void;
};

const RedditPostContext = createContext<RedditPostContextType | undefined>(undefined);

type RedditPostProviderProps = {
  children: ReactNode;
};

export const RedditPostProvider = ({ children }: RedditPostProviderProps) => {
  const { toast } = useToast();
  const { channels } = useChannels();
  const redditChannel = channels.find((c) => c.type.id === CHANNEL_TYPES.reddit.id);
  const [drafts, setDrafts] = useState<SubredditPostDraft[]>([]);

  const updateSelectedSubreddits = (selectedIds: string[], subreddits: Subreddit[]) => {
    setDrafts(
      selectedIds.map((id) => ({
        subreddit: subreddits.find((s) => s.id === id)!,
      }))
    );
  };

  const updateDraftMedia = (subredditId: string, media: Media | null) => {
    setDrafts((prev) =>
      prev.map((draft) => {
        if (draft.subreddit.id !== subredditId) return draft;
        return { ...draft, media };
      })
    );
  };

  const updateDraftUrl = (subredditId: string, url: string) => {
    setDrafts((prev) =>
      prev.map((draft) => {
        if (draft.subreddit.id !== subredditId) return draft;
        return { ...draft, url };
      })
    );
  };

  const updateDraftCaption = (subredditId: string, caption: string) => {
    setDrafts((prev) =>
      prev.map((draft) => {
        if (draft.subreddit.id !== subredditId) return draft;
        return { ...draft, caption };
      })
    );
  };

  const postDraft = async (subredditId: string) => {
    if (!redditChannel) return;
    const draft = drafts.find((d) => d.subreddit.id === subredditId);
    if (!draft) return;

    const newPost = await window.api["post:create"](
      {
        date: new Date().toISOString(),
        channelId: redditChannel.id,
        status: "posted",
        caption: draft.caption,
        subredditId,
      },
      [draft.media.id]
    );

    if (!newPost) {
      toast({
        title: "Failed to create post",
        description: "Please try again",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post created successfully",
    });
    setDrafts((prev) =>
      prev.map((draft) => {
        if (draft.subreddit.id !== subredditId) return draft;
        return { ...draft, postId: newPost.id };
      })
    );
  };

  return (
    <RedditPostContext.Provider
      value={{
        drafts,
        updateSelectedSubreddits,
        updateDraftMedia,
        updateDraftUrl,
        updateDraftCaption,
        postDraft,
      }}
    >
      {children}
    </RedditPostContext.Provider>
  );
};

export const useRedditPost = () => {
  const context = useContext(RedditPostContext);
  if (!context) {
    throw new Error("useRedditPost must be used within a RedditPostProvider");
  }
  return context;
};
