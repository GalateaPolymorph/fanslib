import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useChannels } from "@renderer/hooks";
import { createContext, ReactNode, useContext, useState } from "react";
import { Media } from "src/features/library/entity";
import { CHANNEL_TYPES } from "../../../features/channels/channelTypes";
import { Subreddit } from "../../../features/channels/subreddit";

export type SubredditPostDraft = {
  subreddit: Subreddit;
  media?: Media | null;
  url?: string;
  caption?: string;
  postId?: string;
};

type RedditPostContextType = {
  drafts: SubredditPostDraft[];
  addDraft: (draft: SubredditPostDraft) => void;
  updateDraft: (subredditId: string, updates: Partial<SubredditPostDraft>) => void;
  removeDraft: (subredditId: string) => void;
  clearDrafts: () => void;
  submitDrafts: () => Promise<void>;
  isSubmitting: boolean;
};

const RedditPostContext = createContext<RedditPostContextType | null>(null);

export const RedditPostProvider = ({ children }: { children: ReactNode }) => {
  const [drafts, setDrafts] = useState<SubredditPostDraft[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: channels = [] } = useChannels();
  const { toast } = useToast();

  const addDraft = (draft: SubredditPostDraft) => {
    setDrafts((prev) => {
      const existing = prev.find((d) => d.subreddit.id === draft.subreddit.id);
      if (existing) {
        return prev.map((d) => (d.subreddit.id === draft.subreddit.id ? { ...d, ...draft } : d));
      }
      return [...prev, draft];
    });
  };

  const updateDraft = (subredditId: string, updates: Partial<SubredditPostDraft>) => {
    setDrafts((prev) =>
      prev.map((draft) => (draft.subreddit.id === subredditId ? { ...draft, ...updates } : draft))
    );
  };

  const removeDraft = (subredditId: string) => {
    setDrafts((prev) => prev.filter((draft) => draft.subreddit.id !== subredditId));
  };

  const clearDrafts = () => {
    setDrafts([]);
  };

  const submitDrafts = async () => {
    setIsSubmitting(true);
    try {
      const redditChannel = channels.find((c) => c.type.name === CHANNEL_TYPES.reddit.name);
      if (!redditChannel) {
        throw new Error("Reddit channel not found");
      }

      const promises = drafts.map(async (draft) => {
        const postData = {
          date: new Date().toISOString(),
          channelId: redditChannel.id,
          status: "posted" as const,
          caption: draft.caption || "",
          subredditId: draft.subreddit.id,
          url: draft.url,
        };

        const mediaIds = draft.media ? [draft.media.id] : [];

        if (draft.postId) {
          return window.api["post:update"](draft.postId, postData, mediaIds);
        } else {
          return window.api["post:create"](postData, mediaIds);
        }
      });

      await Promise.all(promises);
      clearDrafts();

      toast({
        title: "Posts submitted successfully",
        description: `${drafts.length} post(s) created/updated`,
      });
    } catch (error) {
      console.error("Failed to submit posts:", error);
      toast({
        title: "Failed to submit posts",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: RedditPostContextType = {
    drafts,
    addDraft,
    updateDraft,
    removeDraft,
    clearDrafts,
    submitDrafts,
    isSubmitting,
  };

  return <RedditPostContext.Provider value={value}>{children}</RedditPostContext.Provider>;
};

export const useRedditPosts = () => {
  const context = useContext(RedditPostContext);
  if (!context) {
    throw new Error("useRedditPosts must be used within a RedditPostProvider");
  }
  return context;
};
