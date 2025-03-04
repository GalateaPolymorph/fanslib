import { Button } from "@renderer/components/ui/button";
import { useRedditPost } from "@renderer/contexts/RedditPostContext";
import { ArrowLeft, PlusCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Subreddit } from "../../../../features/channels/subreddit";
import { CreateSubredditDialog } from "./CreateSubredditDialog";
import { SubredditPostDrafter } from "./SubredditPostDrafter";
import { SubredditTable } from "./SubredditTable";

export const SubredditsPage = () => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { drafts, updateSelectedSubreddits } = useRedditPost();

  const selectedSubreddits = drafts.filter((draft) => draft.subreddit);

  const [view, setView] = useState<"subreddits" | "posting">(
    selectedSubreddits.length > 0 ? "posting" : "subreddits"
  );

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
        <div className="flex gap-2">
          {selectedSubreddits.length > 0 && view === "subreddits" && (
            <Button onClick={() => setView("posting")} style={{ backgroundColor: "#ff4500" }}>
              <Send className="mr-2 h-4 w-4" /> Post in{" "}
              <span className="font-bold rounded bg-muted/30 px-1 size-5">
                {selectedSubreddits.length}
              </span>{" "}
              subreddit{selectedSubreddits.length > 1 ? "s" : ""}
            </Button>
          )}
          {view === "posting" && (
            <Button variant="ghost" onClick={() => setView("subreddits")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}
          <Button variant="secondary" onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Subreddit
          </Button>
        </div>
      </div>

      {view === "subreddits" && (
        <SubredditTable
          subreddits={subreddits}
          onSubredditUpdated={loadSubreddits}
          onSelectionChange={(selectedIds) => updateSelectedSubreddits(selectedIds, subreddits)}
        />
      )}

      {view === "posting" && <SubredditPostDrafter subreddits={subreddits} />}

      <CreateSubredditDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubredditCreated={loadSubreddits}
      />
    </div>
  );
};
