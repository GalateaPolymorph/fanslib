import { useEffect, useState } from "react";
import { HashtagWithStats } from "../../../../features/hashtags/api-type";
import { ChannelHashtagTable } from "./ChannelHashtagTable";
import { HashtagTable } from "./HashtagTable";
import { NicheTable } from "./NicheTable";

export const TaggingPage = () => {
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
      loadHashtags();
    } catch (error) {
      console.error("Failed to update hashtag stats", error);
    }
  };

  return (
    <div className="px-6 py-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tagging</h2>
        <NicheTable onNicheUpdated={loadHashtags} />
      </div>

      <ChannelHashtagTable />

      <HashtagTable
        hashtags={hashtags}
        onStatsChange={updateHashtagStats}
        onHashtagCreated={loadHashtags}
        onHashtagDeleted={loadHashtags}
      />
    </div>
  );
};
