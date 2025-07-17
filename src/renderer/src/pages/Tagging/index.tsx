import { PageContainer } from "../../components/ui/PageContainer/PageContainer";
import { PageHeader } from "../../components/ui/PageHeader/PageHeader";
import { Tabs } from "../../components/ui/Tabs";
import { useHashtags, useUpdateHashtagStats } from "../../hooks/api/useHashtags";
import { ChannelHashtagTable } from "./ChannelHashtagTable";
import { HashtagTable } from "./HashtagTable";
import { TagManager } from "./TagManager";

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
    <PageContainer>
      <PageHeader
        title="Tagging"
        titleSize="lg"
        description="Manage hashtags and tag dimensions for your content organization"
        spacing="lg"
      />

      <Tabs
        items={[
          {
            id: "hashtags",
            label: "Hashtags",
            content: (
              <div className="space-y-8">
                <ChannelHashtagTable />
                <HashtagTable
                  hashtags={hashtags}
                  onStatsChange={updateHashtagStats}
                  onHashtagCreated={handleHashtagUpdated}
                  onHashtagDeleted={handleHashtagUpdated}
                />
              </div>
            ),
          },
          {
            id: "dimensions",
            label: "Tag Dimensions",
            content: <TagManager />,
          },
        ]}
      />
    </PageContainer>
  );
};
