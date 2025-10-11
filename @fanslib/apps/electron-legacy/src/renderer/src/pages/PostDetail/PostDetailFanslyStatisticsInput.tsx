import { Button } from "@renderer/components/ui/Button";
import { Input } from "@renderer/components/ui/Input";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { useFieldUpdate } from "@renderer/hooks/forms/useFieldUpdate";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Post } from "src/features/posts/entity";

type PostDetailFanslyStatisticsInputProps = {
  post: Post;
};

export const PostDetailFanslyStatisticsInput = ({ post }: PostDetailFanslyStatisticsInputProps) => {
  const [localStatisticsId, setLocalStatisticsId] = useState(post.fanslyStatisticsId ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { updateField, isUpdating } = useFieldUpdate<string>({
    post,
    fieldName: "fanslyStatisticsId",
    transform: (value: string) => {
      const parsed = parseStatisticsId(value);
      return parsed;
    },
  });

  const parseStatisticsId = (input: string): string | null => {
    // If it's an 18-digit number, use it directly
    if (/^\d{18}$/.test(input)) {
      return input;
    }

    // If it's a URL with the structure fansly.com/statistics/<number>
    const urlMatch = input.match(/fansly\.com\/statistics\/(\d{18})/);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }

    // If it's not empty but doesn't match either pattern, it's invalid
    if (input.trim() !== "") {
      return null;
    }

    // Empty input is treated as null
    return null;
  };

  const updateStatisticsId = (newValue: string) => {
    setLocalStatisticsId(newValue);
    updateField(newValue);
  };

  const fetchAnalytics = async () => {
    if (!post.fanslyStatisticsId) {
      toast({
        title: "No Statistics ID",
        description: "Please enter a valid Fansly Statistics ID first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await window.api["analytics:fetchFanslyAnalyticsData"](post.id);
      toast({
        title: "Analytics data fetched",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to fetch analytics data",
        variant: "destructive",
      });
      console.error("Failed to fetch analytics data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="fansly-statistics-id" className="text-sm font-medium">
        Fansly Statistics ID
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="fansly-statistics-id"
            placeholder="Enter ID or fansly.com/statistics/... URL"
            value={localStatisticsId}
            onChange={(e) => updateStatisticsId(e.target.value)}
            disabled={isUpdating}
          />
          {isUpdating && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="text-xs text-muted-foreground">Updating...</div>
            </div>
          )}
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={fetchAnalytics}
          disabled={isLoading || !post.fanslyStatisticsId}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </div>
  );
};
