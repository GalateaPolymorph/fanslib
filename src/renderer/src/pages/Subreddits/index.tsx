import { Button } from "@renderer/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Subreddit } from "../../../../features/channels/subreddit";
import { CreateSubredditDialog } from "./CreateSubredditDialog";
import { SubredditTable } from "./SubredditTable";

export const SubredditsPage = () => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const loadSubreddits = async () => {
    try {
      const allSubreddits = await window.api["channel:subreddit-list"]();
      setSubreddits(allSubreddits);
    } catch (error) {
      console.error("Failed to load subreddits", error);
    }
  };

  useEffect(() => {
    loadSubreddits();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subreddits</h1>
        <Button variant="secondary" onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Subreddit
        </Button>
      </div>

      <SubredditTable subreddits={subreddits} onSubredditUpdated={loadSubreddits} />

      <CreateSubredditDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubredditCreated={loadSubreddits}
      />
    </div>
  );
};
