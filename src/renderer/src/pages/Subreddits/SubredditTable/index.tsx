import { cn } from "@renderer/lib/utils";
import { useState } from "react";
import { Subreddit } from "../../../../../features/channels/subreddit";
import { EditingSubredditRow } from "./EditingSubredditRow";
import { SubredditRow } from "./SubredditRow";
import { SubredditTableHeader } from "./SubredditTableHeader";
import { gridClasses } from "./table";

type SubredditTableProps = {
  subreddits: Subreddit[];
  onSubredditUpdated: () => void;
};

export const SubredditTable = ({ subreddits, onSubredditUpdated }: SubredditTableProps) => {
  const [editingSubredditId, setEditingSubredditId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <SubredditTableHeader />
        {subreddits.map((subreddit, i) => (
          <div className={cn(gridClasses, i % 2 === 0 && "bg-muted/50")} key={subreddit.id}>
            {editingSubredditId === subreddit.id ? (
              <EditingSubredditRow
                subreddit={subreddit}
                onUpdate={() => {
                  setEditingSubredditId(null);
                  onSubredditUpdated();
                }}
              />
            ) : (
              <SubredditRow
                subreddit={subreddit}
                onEdit={() => setEditingSubredditId(subreddit.id)}
                onSubredditDeleted={onSubredditUpdated}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
