import { useSubredditLastPostDates } from "@renderer/hooks/api/useSubredditLastPostDates";
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
  onSelectionChange: (selectedIds: string[]) => void;
};

export const SubredditTable = ({
  subreddits,
  onSubredditUpdated,
  onSelectionChange,
}: SubredditTableProps) => {
  const [editingSubredditId, setEditingSubredditId] = useState<string | null>(null);
  const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>([]);

  const subredditIds = subreddits.map((s) => s.id);
  const { data: lastPostDates = {} } = useSubredditLastPostDates(subredditIds);

  const toggleSubredditSelection = (id: string) => {
    setSelectedSubreddits((prev) => {
      const next = prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : prev.length >= 10
          ? prev
          : [...prev, id];
      onSelectionChange(next);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <SubredditTableHeader />
        {subreddits.map((subreddit, i) => {
          const bgClasses = selectedSubreddits.includes(subreddit.id)
            ? "bg-primary/5"
            : i % 2 === 0
              ? "bg-muted/40"
              : "bg-transparent";

          return (
            <div className={cn(gridClasses, bgClasses)} key={subreddit.id}>
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
                  isSelected={selectedSubreddits.includes(subreddit.id)}
                  onToggleSelect={toggleSubredditSelection}
                  lastPostDate={lastPostDates[subreddit.id]}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
