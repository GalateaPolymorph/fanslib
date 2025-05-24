import { Button } from "@renderer/components/ui/button";
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subreddits</h1>
        <Button variant="secondary" onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Subreddit
        </Button>
      </div>

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
    </div>
  );
};
