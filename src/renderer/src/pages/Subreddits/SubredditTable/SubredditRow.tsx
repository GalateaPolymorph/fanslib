import { Button } from "@renderer/components/ui/button";
import { formatViewCount } from "@renderer/lib/format-views";
import { ExternalLink, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Subreddit } from "src/features/channels/subreddit";
import { VerificationStatus } from "../../../components/VerificationStatus";
import { DeleteSubredditButton } from "./DeleteSubredditButton";

type SubredditRowProps = {
  subreddit: Subreddit;
  onEdit: () => void;
  onSubredditDeleted: () => void;
};

export const SubredditRow = ({ subreddit, onEdit, onSubredditDeleted }: SubredditRowProps) => {
  return (
    <>
      <div className="p-2 pl-4 min-h-12 flex items-center">
        <Link
          to={`https://reddit.com/r/${subreddit.name}`}
          className="flex items-center gap-2 group"
        >
          <span className="text-foreground">
            r/<strong>{subreddit.name}</strong>
          </span>{" "}
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100" />
        </Link>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <span className="text-muted-foreground">
          {subreddit.memberCount ? formatViewCount(subreddit.memberCount) : "-"}
        </span>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <span className="text-muted-foreground">{subreddit.maxPostFrequencyHours ?? "-"}</span>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <VerificationStatus status={subreddit.verificationStatus} />
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <span className="text-muted-foreground">{subreddit.notes ?? "-"}</span>
      </div>
      <div className="p-2 pr-4 min-h-12 flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <DeleteSubredditButton
          subredditId={subreddit.id}
          subredditName={subreddit.name}
          onSubredditDeleted={onSubredditDeleted}
        />
      </div>
    </>
  );
};
