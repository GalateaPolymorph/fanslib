import {
  FilterActions,
  MediaFilters as MediaFiltersComponent,
  RedditChannelFilterPreset,
} from "@renderer/components/MediaFilters";
import { MediaFiltersProvider } from "@renderer/components/MediaFilters/MediaFiltersContext";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { useUpdateSubreddit } from "@renderer/hooks/api/useChannels";
import { formatViewCount, parseViewCount } from "@renderer/lib/format-views";
import { Check } from "lucide-react";
import { useState } from "react";
import { Subreddit } from "src/features/channels/subreddit";
import {
  VERIFICATION_STATUS,
  type VerificationStatus,
} from "../../../../../features/channels/type";
import { sanitizeFilterInput } from "../../../../../features/library/filter-helpers";
import { VerificationStatus as VerificationStatusComponent } from "../../../components/VerificationStatus";
import { EditingSubreddit } from "./type";

type EditingSubredditRowProps = {
  subreddit: Subreddit;
  onUpdate: () => void;
};

export const EditingSubredditRow = ({ subreddit, onUpdate }: EditingSubredditRowProps) => {
  const updateSubredditMutation = useUpdateSubreddit();
  const [editingSubreddit, setEditingSubreddit] = useState<EditingSubreddit>({
    ...subreddit,
    eligibleMediaFilter: sanitizeFilterInput(subreddit.eligibleMediaFilter),
  });
  const [unparsedMemberCount, setUnparsedMemberCount] = useState<string>(
    subreddit.memberCount ? formatViewCount(subreddit.memberCount) : ""
  );

  const updateSubreddit = async () => {
    try {
      await updateSubredditMutation.mutateAsync({
        subredditId: subreddit.id,
        updates: {
          name: editingSubreddit.name,
          maxPostFrequencyHours: editingSubreddit.maxPostFrequencyHours,
          notes: editingSubreddit.notes,
          memberCount: parseViewCount(unparsedMemberCount.replaceAll(",", ".")),
          verificationStatus: editingSubreddit.verificationStatus,
          eligibleMediaFilter: editingSubreddit.eligibleMediaFilter,
          defaultFlair: editingSubreddit.defaultFlair,
          captionPrefix: editingSubreddit.captionPrefix,
        },
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to update subreddit", error);
    }
  };

  return (
    <div className="contents">
      <div />
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
      <div />
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
          value={editingSubreddit.defaultFlair ?? ""}
          onChange={(e) =>
            setEditingSubreddit({ ...editingSubreddit, defaultFlair: e.target.value })
          }
          className="h-8"
          placeholder="Default flair"
        />
      </div>
      <div className="p-2 min-h-12 flex items-center">
        <Input
          value={editingSubreddit.captionPrefix ?? ""}
          onChange={(e) =>
            setEditingSubreddit({ ...editingSubreddit, captionPrefix: e.target.value })
          }
          className="h-8"
          placeholder="Caption prefix"
        />
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
      <div className="col-span-full p-4 border-t">
        <div className="space-y-3">
          <MediaFiltersProvider
            value={editingSubreddit.eligibleMediaFilter}
            onChange={(filter) =>
              setEditingSubreddit({ ...editingSubreddit, eligibleMediaFilter: filter })
            }
          >
            <div className="flex items-center justify-end">
              <RedditChannelFilterPreset
                onApplyFilter={(filter) =>
                  setEditingSubreddit({
                    ...editingSubreddit,
                    eligibleMediaFilter: sanitizeFilterInput(filter),
                  })
                }
              />
              <FilterActions />
            </div>
            <MediaFiltersComponent
              value={editingSubreddit.eligibleMediaFilter}
              onChange={(filter) =>
                setEditingSubreddit({ ...editingSubreddit, eligibleMediaFilter: filter })
              }
            />
          </MediaFiltersProvider>
        </div>
      </div>
    </div>
  );
};
