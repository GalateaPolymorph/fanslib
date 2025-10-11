import { Button } from "@renderer/components/ui/Button";
import { Checkbox } from "@renderer/components/ui/Checkbox";
import { usePostFrequencyStatus } from "@renderer/hooks";
import { formatViewCount } from "@renderer/lib/format-views";
import { cn } from "@renderer/lib/utils";
import { ExternalLink, Pencil, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Subreddit } from "src/features/channels/subreddit";
import { VerificationStatus } from "../../../components/VerificationStatus";
import { DeleteSubredditButton } from "./DeleteSubredditButton";
import { PostFrequencyStatus } from "./PostFrequencyStatus";

type SubredditRowProps = {
  subreddit: Subreddit;
  onEdit: () => void;
  onSubredditDeleted: () => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  lastPostDate?: string | null;
};

export const SubredditRow = ({
  subreddit,
  onEdit,
  onSubredditDeleted,
  isSelected,
  onToggleSelect,
  lastPostDate,
}: SubredditRowProps) => {
  const { canPost } = usePostFrequencyStatus(lastPostDate, subreddit.maxPostFrequencyHours);

  const selectRow = () => {
    if (!canPost) return;
    onToggleSelect(subreddit.id);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const textClasses = canPost ? "text-foreground" : "text-muted-foreground/50";

  return (
    <div
      onClick={selectRow}
      className={cn("contents cursor-pointer group/row", !canPost && "cursor-not-allowed")}
    >
      <div className="p-2 pl-4 min-h-12 flex items-center">
        <div onClick={stopPropagation}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(subreddit.id)}
            disabled={!canPost}
          />
        </div>
      </div>
      <div className="p-2 pl-4 min-h-12 flex items-center">
        <Link
          to={`https://reddit.com/r/${subreddit.name}`}
          target="_blank"
          className="flex items-center gap-2 group"
          onClick={stopPropagation}
        >
          <span className={textClasses}>
            r/<strong>{subreddit.name}</strong>
          </span>{" "}
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100" />
        </Link>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <span className={textClasses}>
          {subreddit.memberCount ? formatViewCount(subreddit.memberCount) : "-"}
        </span>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <span className={textClasses}>{subreddit.maxPostFrequencyHours ?? "-"}</span>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <PostFrequencyStatus
          lastPostDate={lastPostDate}
          maxPostFrequencyHours={subreddit.maxPostFrequencyHours}
        />
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <VerificationStatus
          status={subreddit.verificationStatus}
          className={canPost ? "" : "opacity-50"}
        />
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <span className={textClasses}>{subreddit.defaultFlair ?? "-"}</span>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <span className={textClasses}>{subreddit.captionPrefix ?? "-"}</span>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <div className="flex items-center gap-2 w-full">
          <span className={textClasses}>{subreddit.notes ?? "-"}</span>
          {subreddit.postingTimesData && subreddit.postingTimesData.length > 0 && (
            <div
              className="inline-flex"
              title={`Posting times analyzed (${new Date(subreddit.postingTimesLastFetched || "").toLocaleDateString()})`}
            >
              <BarChart3 className="h-3 w-3 text-blue-500 flex-shrink-0" />
            </div>
          )}
        </div>
      </div>
      <div className="p-2 pr-4 min-h-12 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={stopPropagation}
          onClickCapture={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <div onClick={stopPropagation}>
          <DeleteSubredditButton
            subredditId={subreddit.id}
            subredditName={subreddit.name}
            onSubredditDeleted={onSubredditDeleted}
          />
        </div>
      </div>
    </div>
  );
};
