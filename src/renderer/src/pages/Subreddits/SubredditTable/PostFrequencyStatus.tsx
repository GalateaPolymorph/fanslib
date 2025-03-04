import { usePostFrequencyStatus } from "@renderer/hooks/usePostFrequencyStatus";
import { cn } from "@renderer/lib/utils";
import { CheckCircle, Timer } from "lucide-react";

type PostFrequencyStatusProps = {
  lastPostDate?: string | null;
  maxPostFrequencyHours?: number | null;
};

export const PostFrequencyStatus = ({
  lastPostDate,
  maxPostFrequencyHours = 24,
}: PostFrequencyStatusProps) => {
  const { canPost, timeLeft } = usePostFrequencyStatus(lastPostDate, maxPostFrequencyHours);

  return (
    <div className="flex items-center gap-2">
      {canPost ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <div className="flex items-center gap-1">
          <Timer className="h-4 w-4 text-yellow-500" />
          <span className={cn("text-sm", timeLeft ? "text-yellow-500" : "text-muted-foreground")}>
            {timeLeft || "Calculating..."}
          </span>
        </div>
      )}
    </div>
  );
};
