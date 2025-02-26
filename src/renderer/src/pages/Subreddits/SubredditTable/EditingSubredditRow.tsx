import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { formatViewCount, parseViewCount } from "@renderer/lib/format-views";
import { Check } from "lucide-react";
import { useState } from "react";
import { Subreddit } from "src/features/channels/subreddit";
import {
  VERIFICATION_STATUS,
  type VerificationStatus,
} from "../../../../../features/channels/type";
import { VerificationStatus as VerificationStatusComponent } from "../../../components/VerificationStatus";
import { EditingSubreddit } from "./type";

type EditingSubredditRowProps = {
  subreddit: Subreddit;
  onUpdate: () => void;
};

export const EditingSubredditRow = ({ subreddit, onUpdate }: EditingSubredditRowProps) => {
  const [editingSubreddit, setEditingSubreddit] = useState<EditingSubreddit>(subreddit);
  const [unparsedMemberCount, setUnparsedMemberCount] = useState<string>(
    subreddit.memberCount ? formatViewCount(subreddit.memberCount) : ""
  );

  const updateSubreddit = async () => {
    try {
      await window.api["channel:subreddit-update"](subreddit.id, {
        name: editingSubreddit.name,
        maxPostFrequencyHours: editingSubreddit.maxPostFrequencyHours,
        notes: editingSubreddit.notes,
        memberCount: parseViewCount(unparsedMemberCount.replaceAll(",", ".")),
        verificationStatus: editingSubreddit.verificationStatus,
      });
      onUpdate();
      setEditingSubreddit(null);
    } catch (error) {
      console.error("Failed to update subreddit", error);
    }
  };

  return (
    <>
      <div className="p-2 pl-4 min-h-12 flex items-center">
        <Input
          value={editingSubreddit.name}
          onChange={(e) => setEditingSubreddit({ ...editingSubreddit, name: e.target.value })}
          className="h-8"
        />
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <Input
          defaultValue={unparsedMemberCount}
          onBlur={(e) => {
            setUnparsedMemberCount(e.target.value);
          }}
          className="h-8"
          placeholder="e.g., 120K"
        />
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <Input
          type="number"
          value={editingSubreddit.maxPostFrequencyHours ?? ""}
          onChange={(e) =>
            setEditingSubreddit({
              ...editingSubreddit,
              maxPostFrequencyHours: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
          className="h-8"
        />
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <Select
          value={editingSubreddit.verificationStatus}
          onValueChange={(value: VerificationStatus) =>
            setEditingSubreddit({ ...editingSubreddit, verificationStatus: value })
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(VERIFICATION_STATUS).map((status) => (
              <SelectItem key={status} value={status}>
                <VerificationStatusComponent status={status} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <Input
          value={editingSubreddit.notes ?? ""}
          onChange={(e) => setEditingSubreddit({ ...editingSubreddit, notes: e.target.value })}
          className="h-8"
        />
      </div>
      <div className="p-2 pr-4 min-h-12 flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateSubreddit()}>
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
