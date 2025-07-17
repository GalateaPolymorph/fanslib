import { Button } from "@renderer/components/ui/Button";
import { PageContainer } from "@renderer/components/ui/PageContainer/PageContainer";
import { PageHeader } from "@renderer/components/ui/PageHeader/PageHeader";
import { useSubreddits } from "@renderer/hooks/api/useChannels";
import { RedditQuickPostCreator } from "@renderer/pages/Subreddits/RedditQuickPostCreator";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Tabs } from "../../components/ui/Tabs";
import { CreateSubredditDialog } from "./CreateSubredditDialog";
import { SubredditTable } from "./SubredditTable";

export const SubredditsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: subreddits = [], refetch } = useSubreddits();

  const handleSubredditUpdated = () => {
    refetch();
  };

  const handleSubredditCreated = () => {
    refetch();
    setIsCreateDialogOpen(false);
  };

  return (
    <PageContainer maxWidth="xl">
      <PageHeader
        title="Subreddits"
        description="Manage your Reddit communities and content distribution"
      />

      <Tabs
        size="lg"
        items={[
          {
            id: "subreddits",
            label: "Subreddit Management",
            content: (
              <div className="space-y-4">
                <div className="flex items-center justify-end">
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Subreddit
                  </Button>
                </div>

                <SubredditTable
                  subreddits={subreddits}
                  onSubredditUpdated={handleSubredditUpdated}
                  onSelectionChange={() => {}}
                />
              </div>
            ),
          },
          {
            id: "posting",
            label: "Reddit Posting",
            content: <RedditQuickPostCreator subreddits={subreddits} />,
          },
        ]}
      ></Tabs>

      <CreateSubredditDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubredditCreated={handleSubredditCreated}
      />
    </PageContainer>
  );
};
