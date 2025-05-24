import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog";
import { Input } from "@renderer/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { Textarea } from "@renderer/components/ui/textarea";
import { useToast } from "@renderer/components/ui/use-toast";
import { useCreateSubreddit } from "@renderer/hooks/api/useChannels";
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
  const [name, setName] = useState("");
  const [maxPostFrequencyHours, setMaxPostFrequencyHours] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [memberCount, setMemberCount] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    VERIFICATION_STATUS.UNKNOWN
  );

  const resetForm = () => {
    setName("");
    setMaxPostFrequencyHours("");
    setNotes("");
    setMemberCount("");
    setVerificationStatus(VERIFICATION_STATUS.UNKNOWN);
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
      await createSubredditMutation.mutateAsync({
        name: nameWithoutR,
        maxPostFrequencyHours: maxPostFrequencyHours ? parseInt(maxPostFrequencyHours) : 24,
        notes: notes.trim() || undefined,
        memberCount: memberCount ? parseViewCount(memberCount) : undefined,
        verificationStatus,
      });

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
          <Button onClick={createSubreddit}>Create Subreddit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
