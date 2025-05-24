import { useHashtags, useUpdateHashtagStats } from "../../hooks/api/useHashtags";
import { ChannelHashtagTable } from "./ChannelHashtagTable";
import { HashtagTable } from "./HashtagTable";
import { NicheTable } from "./NicheTable";

export const TaggingPage = () => {
  const { data: hashtags = [], refetch } = useHashtags();
  const updateHashtagStatsMutation = useUpdateHashtagStats();

  const updateHashtagStats = async (hashtagId: number, channelId: string, viewCount: number) => {
    try {
      await updateHashtagStatsMutation.mutateAsync({ hashtagId, channelId, viewCount });
      refetch();
    } catch (error) {
      console.error("Failed to update hashtag stats", error);
    }
  };

  const handleHashtagUpdated = () => {
    refetch();
  };

  return (
    <div className="px-6 py-6 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tagging</h2>
        <NicheTable onNicheUpdated={handleHashtagUpdated} />
      </div>

      <ChannelHashtagTable />

      <HashtagTable
        hashtags={hashtags}
        onStatsChange={updateHashtagStats}
        onHashtagCreated={handleHashtagUpdated}
        onHashtagDeleted={handleHashtagUpdated}
      />
    </div>
  );
};
