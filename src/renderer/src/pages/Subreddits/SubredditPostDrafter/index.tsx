import { MediaSelection } from "@renderer/components/MediaSelection";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { useRedditPosts } from "@renderer/contexts/RedditPostContext";
import { useState } from "react";
import { Subreddit } from "../../../../../features/channels/subreddit";
import { Media } from "../../../../../features/library/entity";
import { SubredditMediaSelectedView } from "./SubredditMediaSelectedView";

type SubredditPostDrafterProps = {
  subreddits: Subreddit[];
};

export const SubredditPostDrafter = ({ subreddits }: SubredditPostDrafterProps) => {
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [selectedSubreddits, setSelectedSubreddits] = useState<Subreddit[]>([]);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const { addDraft } = useRedditPosts();

  const createDrafts = () => {
    selectedSubreddits.forEach((subreddit) => {
      addDraft({
        subreddit,
        media: selectedMedia[0] || null,
        url,
        caption,
      });
    });

    // Reset form
    setSelectedMedia([]);
    setSelectedSubreddits([]);
    setUrl("");
    setCaption("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Select Media</label>
        <MediaSelection
          selectedMedia={selectedMedia}
          onMediaSelect={(media) => setSelectedMedia([media])}
          pageLimit={5}
        />
      </div>

      <div>
        <label className="text-sm font-medium">URL (optional)</label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
      </div>

      <div>
        <label className="text-sm font-medium">Caption</label>
        <Input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Post caption..."
        />
      </div>

      <div>
        <label className="text-sm font-medium">Select Subreddits</label>
        <div className="space-y-2">
          {subreddits.map((subreddit) => (
            <label key={subreddit.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSubreddits.some((s) => s.id === subreddit.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSubreddits([...selectedSubreddits, subreddit]);
                  } else {
                    setSelectedSubreddits(selectedSubreddits.filter((s) => s.id !== subreddit.id));
                  }
                }}
              />
              <span>{subreddit.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        onClick={createDrafts}
        disabled={selectedSubreddits.length === 0 || selectedMedia.length === 0}
      >
        Create Drafts
      </Button>

      {selectedMedia[0] && <SubredditMediaSelectedView media={selectedMedia[0]} />}
    </div>
  );
};
