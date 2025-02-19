import { useEffect, useState } from "react";
import { HashtagWithStats } from "../../../../features/hashtags/api-type";
import { HashtagTable } from "./HashtagTable";
import { NicheSettings } from "./Niches";

export const TagsPage = () => {
  const [hashtags, setHashtags] = useState<HashtagWithStats[]>([]);

  const loadHashtags = async () => {
    try {
      const allHashtags = await window.api["hashtag:list"]();
      console.log(allHashtags);
      setHashtags(allHashtags);
    } catch (error) {
      console.error("Failed to load hashtags", error);
    }
  };

  useEffect(() => {
    loadHashtags();
  }, []);

  const updateHashtagStats = async (hashtagId: number, channelId: string, viewCount: number) => {
    try {
      await window.api["hashtag:stats:set"](hashtagId, channelId, viewCount);
      loadHashtags(); // Reload data after update
    } catch (error) {
      console.error("Failed to update hashtag stats", error);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Niches</h2>
        <NicheSettings />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Hashtag Statistics</h3>
        <HashtagTable
          hashtags={hashtags}
          onStatsChange={updateHashtagStats}
          onHashtagCreated={loadHashtags}
          onHashtagDeleted={loadHashtags}
        />
      </div>
    </div>
  );
};
