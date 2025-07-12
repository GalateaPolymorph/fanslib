import { Button } from "@renderer/components/ui/Button";
import { Input } from "@renderer/components/ui/Input";
import { useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { parseAnalyticsResponse } from "../../../../lib/fansly-analytics";
import { PostAnalyticsGraph } from "./PostAnalyticsGraph";
import { PostAnalyticsSummary } from "./PostAnalyticsSummary";

type PostDetailAnalyticsProps = {
  post: Post;
};

export const PostDetailAnalytics = ({ post }: PostDetailAnalyticsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  if (post.channel.typeId !== "fansly") {
    return null;
  }

  const saveAnalytics = async () => {
    setError(null);
    const data = parseAnalyticsResponse(inputValue);
    if (!data) {
      setError("Invalid analytics data format");
      return;
    }

    if (data.response.dataset.period !== 86400000) {
      setError("Only 'Last 30 days' analytics are supported for now.");
      return;
    }

    try {
      await window.api["analytics:addDatapointsToPost"](post.id, data);
      setInputValue("");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save analytics data");
    }
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Analytics</h2>
      <div className="flex gap-2">
        <Input
          placeholder="Paste Fansly API response JSON here..."
          className="font-mono text-sm"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={saveAnalytics}>Save Datapoints</Button>
      </div>
      {error && <div className="text-sm text-destructive">{error}</div>}
      <PostAnalyticsSummary post={post} />
      <PostAnalyticsGraph post={post} />
    </div>
  );
};
