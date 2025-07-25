import { Button } from "@renderer/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/Dialog";
import { Input } from "@renderer/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/Select";
import { Textarea } from "@renderer/components/ui/Textarea";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import {
  useCreateSubreddit,
  useAnalyzeSubredditPostingTimes,
} from "@renderer/hooks/api/useChannels";
import { parseViewCount } from "@renderer/lib/format-views";
import { useState } from "react";
import { VERIFICATION_STATUS, type VerificationStatus } from "../../../../features/channels/type";
import { VerificationStatus as VerificationStatusComponent } from "../../components/VerificationStatus";

type CreateSubredditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubredditCreated: () => void;
};

export const CreateSubredditDialog = ({
  open,
  onOpenChange,
  onSubredditCreated,
}: CreateSubredditDialogProps) => {
  const { toast } = useToast();
  const createSubredditMutation = useCreateSubreddit();
  const analyzePostingTimesMutation = useAnalyzeSubredditPostingTimes();
  const [name, setName] = useState("");
  const [maxPostFrequencyHours, setMaxPostFrequencyHours] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    VERIFICATION_STATUS.UNKNOWN
  );
  const [defaultFlair, setDefaultFlair] = useState("");
  const [captionPrefix, setCaptionPrefix] = useState("");

  const resetForm = () => {
    setName("");
    setMaxPostFrequencyHours("");
    setNotes("");
    setMemberCount("");
    setVerificationStatus(VERIFICATION_STATUS.UNKNOWN);
    setDefaultFlair("");
    setCaptionPrefix("");
  };

  const createSubreddit = async () => {
    const nameWithoutR = name.trim().replace(/^r\//, "");
    if (!nameWithoutR.trim()) {
      toast({
        title: "Please fill in required fields",
        description: "Name and URL are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdSubreddit = await createSubredditMutation.mutateAsync({
        name: nameWithoutR,
        maxPostFrequencyHours: maxPostFrequencyHours ? parseInt(maxPostFrequencyHours) : 24,
        notes: notes.trim() || undefined,
        memberCount: memberCount ? parseViewCount(memberCount) : undefined,
        verificationStatus,
        defaultFlair: defaultFlair.trim() || undefined,
        captionPrefix: captionPrefix.trim() || undefined,
      });

      // Automatically analyze posting times for the new subreddit
      try {
        await analyzePostingTimesMutation.mutateAsync({
          subredditId: createdSubreddit.id,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      } catch (analysisError) {
        console.warn("Failed to analyze posting times for new subreddit:", analysisError);
        // Don't show error to user - this is a nice-to-have feature
      }

      onSubredditCreated();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create subreddit", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Subreddit</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., nsfwhardcore"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="memberCount" className="text-sm font-medium">
              Member Count
            </label>
            <Input
              id="memberCount"
              value={memberCount}
              onChange={(e) => setMemberCount(e.target.value)}
              placeholder="e.g., 120K"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="frequency" className="text-sm font-medium">
              Post Frequency (hours)
            </label>
            <Input
              id="frequency"
              type="number"
              value={maxPostFrequencyHours}
              onChange={(e) => setMaxPostFrequencyHours(e.target.value)}
              placeholder="e.g., 12 (default is 24)"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="verificationStatus" className="text-sm font-medium">
              Verification Status
            </label>
            <Select
              value={verificationStatus}
              onValueChange={(value: VerificationStatus) => setVerificationStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select verification status" />
              </SelectTrigger>
              <SelectContent>
                {(Object.values(VERIFICATION_STATUS) as VerificationStatus[]).map((value) => (
                  <SelectItem key={value} value={value}>
                    <VerificationStatusComponent status={value} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="defaultFlair" className="text-sm font-medium">
              Default Flair
            </label>
            <Input
              id="defaultFlair"
              value={defaultFlair}
              onChange={(e) => setDefaultFlair(e.target.value)}
              placeholder="e.g., NSFW"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="captionPrefix" className="text-sm font-medium">
              Caption Prefix
            </label>
            <Input
              id="captionPrefix"
              value={captionPrefix}
              onChange={(e) => setCaptionPrefix(e.target.value)}
              placeholder="e.g., Check out my latest post:"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this subreddit..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={createSubreddit}
            disabled={createSubredditMutation.isPending || analyzePostingTimesMutation.isPending}
          >
            {createSubredditMutation.isPending
              ? "Creating..."
              : analyzePostingTimesMutation.isPending
                ? "Analyzing posting times..."
                : "Create Subreddit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
