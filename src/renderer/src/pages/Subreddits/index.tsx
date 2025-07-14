import { RedditQuickPostCreator } from "@renderer/pages/Subreddits/RedditQuickPostCreator";
import { Button } from "@renderer/components/ui/Button";
import { PageContainer } from "@renderer/components/ui/PageContainer/PageContainer";
import { PageHeader } from "@renderer/components/ui/PageHeader/PageHeader";
import { useSubreddits } from "@renderer/hooks/api/useChannels";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
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
    <PageContainer>
      <PageHeader
        title="Subreddits"
        description="Manage your Reddit communities and content distribution"
        actions={
          <Button variant="secondary" onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Subreddit
          </Button>
        }
      />

      <RedditQuickPostCreator subreddits={subreddits} />

      <SubredditTable
        subreddits={subreddits}
        onSubredditUpdated={handleSubredditUpdated}
        onSelectionChange={() => {}}
      />

      <CreateSubredditDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubredditCreated={handleSubredditCreated}
      />
    </PageContainer>
  );
};
