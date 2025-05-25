import { Loader2 } from "lucide-react";
import {
  ActionableInsight,
  ContentThemeInsight as ContentThemeInsightType,
  HashtagInsight as HashtagInsightType,
  PostTimingInsight as PostTimingInsightType,
  VideoLengthInsight as VideoLengthInsightType,
} from "../../../../../features/analytics/api-type";
import { useInsights } from "../../../hooks/analytics/useInsights";
import { Alert, AlertDescription } from "../../ui/alert";
import { ContentThemeInsight } from "./ContentThemeInsight";
import { HashtagInsight } from "./HashtagInsight";
import { PostTimingInsight } from "./PostTimingInsight";
import { VideoLengthInsight } from "./VideoLengthInsight";

const renderInsight = (insight: ActionableInsight) => {
  switch (insight.type) {
    case "videoLength":
      return <VideoLengthInsight key={insight.type} insight={insight as VideoLengthInsightType} />;
    case "hashtag":
      return (
        <HashtagInsight
          key={`${insight.type}-${insight.supportingData.hashtag}`}
          insight={insight as HashtagInsightType}
        />
      );
    case "contentTheme":
      return (
        <ContentThemeInsight
          key={`${insight.type}-${insight.supportingData.theme}`}
          insight={insight as ContentThemeInsightType}
        />
      );
    case "postTiming":
      return <PostTimingInsight key={insight.type} insight={insight as PostTimingInsightType} />;
    default:
      return null;
  }
};

export const InsightsPanel = () => {
  const { data: insights, isLoading, error } = useInsights();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Analyzing your content patterns...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to generate insights. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          Not enough data to generate insights. Make sure you have analytics data for at least 5
          posts and try again after publishing more content.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">📊 Actionable Insights</h2>
          <p className="text-gray-600 text-sm">
            Data-driven recommendations to improve your content performance
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {insights.length} insight{insights.length !== 1 ? "s" : ""} found
        </div>
      </div>

      <div className="grid gap-6">{insights.map((insight) => renderInsight(insight))}</div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <h3 className="font-medium text-blue-900 mb-2">💡 How to use these insights</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Focus on insights with high confidence scores first</li>
          <li>• Apply recommendations gradually and track performance changes</li>
          <li>• Insights update automatically as you add more content</li>
          <li>• Check back regularly for updated recommendations</li>
        </ul>
      </div>
    </div>
  );
};
