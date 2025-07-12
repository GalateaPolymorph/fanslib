import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
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
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tagging</h1>
        <p className="text-muted-foreground mt-2">
          Manage hashtags and tag dimensions for your content organization
        </p>
      </div>

      <Tabs defaultValue="hashtags" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="dimensions">Tag Dimensions</TabsTrigger>
        </TabsList>

        <TabsContent value="hashtags" className="space-y-8">
          <ChannelHashtagTable />
          <HashtagTable
            hashtags={hashtags}
            onStatsChange={updateHashtagStats}
            onHashtagCreated={handleHashtagUpdated}
            onHashtagDeleted={handleHashtagUpdated}
          />
        </TabsContent>

        <TabsContent value="dimensions">
          <TagManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
