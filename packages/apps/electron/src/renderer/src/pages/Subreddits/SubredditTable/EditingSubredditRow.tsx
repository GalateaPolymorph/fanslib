import { FilterActions } from "@renderer/components/MediaFilters/FilterActions";
import { MediaFilters as MediaFiltersComponent } from "@renderer/components/MediaFilters/MediaFilters";
import { MediaFiltersProvider } from "@renderer/components/MediaFilters/MediaFiltersContext";
import { RedditChannelFilterPreset } from "@renderer/components/MediaFilters/RedditChannelFilterPreset";
import { Button } from "@renderer/components/ui/Button";
import { Input } from "@renderer/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/Select";
import { FilterPresetProvider } from "@renderer/contexts/FilterPresetContext";
import {
  useAnalyzeSubredditPostingTimes,
  useUpdateSubreddit,
} from "@renderer/hooks/api/useChannels";
import { formatViewCount, parseViewCount } from "@renderer/lib/format-views";
import { BarChart3, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Subreddit } from "src/features/channels/subreddit";
import {
  VERIFICATION_STATUS,
  type VerificationStatus,
} from "../../../../../features/channels/type";
import { sanitizeFilterInput } from "../../../../../features/library/filter-helpers";
import { VerificationStatus as VerificationStatusComponent } from "../../../components/VerificationStatus";
import { SubredditPostingTimesHeatmap } from "./SubredditPostingTimesHeatmap";
import { EditingSubreddit } from "./type";

type EditingSubredditRowProps = {
  subreddit: Subreddit;
  onUpdate: () => void;
};

export const EditingSubredditRow = ({ subreddit, onUpdate }: EditingSubredditRowProps) => {
  const updateSubredditMutation = useUpdateSubreddit();
  const analyzePostingTimesMutation = useAnalyzeSubredditPostingTimes();
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
          postingTimesData: editingSubreddit.postingTimesData,
          postingTimesLastFetched: editingSubreddit.postingTimesLastFetched,
          postingTimesTimezone: editingSubreddit.postingTimesTimezone,
        },
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to update subreddit", error);
    }
  };

  const analyzePostingTimes = async () => {
    try {
      const result = await analyzePostingTimesMutation.mutateAsync({
        subredditId: subreddit.id,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      // Update local state with the new posting times data
      setEditingSubreddit({
        ...editingSubreddit,
        postingTimesData: result.postingTimesData,
        postingTimesLastFetched: result.postingTimesLastFetched,
        postingTimesTimezone: result.postingTimesTimezone,
      });
    } catch (error) {
      console.error("Failed to analyze posting times", error);
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
        <div className="space-y-6">
          <div>
            <MediaFiltersProvider
              value={editingSubreddit.eligibleMediaFilter}
              onChange={(filter) =>
                setEditingSubreddit({ ...editingSubreddit, eligibleMediaFilter: filter })
              }
            >
              <FilterPresetProvider
                onFiltersChange={(filter) => {
                  setEditingSubreddit({ ...editingSubreddit, eligibleMediaFilter: filter });
                }}
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
                <MediaFiltersComponent />
              </FilterPresetProvider>
            </MediaFiltersProvider>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Posting Times Analysis</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={analyzePostingTimes}
                disabled={analyzePostingTimesMutation.isPending}
                className="gap-2"
              >
                {analyzePostingTimesMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4" />
                )}
                {analyzePostingTimesMutation.isPending ? "Analyzing..." : "Analyze Posting Times"}
              </Button>
            </div>

            <SubredditPostingTimesHeatmap
              postingTimes={editingSubreddit.postingTimesData || []}
              timezone={editingSubreddit.postingTimesTimezone}
            />

            {editingSubreddit.postingTimesLastFetched && (
              <p className="text-xs text-gray-500 text-center">
                Last updated: {new Date(editingSubreddit.postingTimesLastFetched).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
