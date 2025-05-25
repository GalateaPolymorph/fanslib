import { HashtagInsight as HashtagInsightType } from "../../../../../features/analytics/api-type";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

type HashtagInsightProps = {
  insight: HashtagInsightType;
};

export const HashtagInsight = ({ insight }: HashtagInsightProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence";
    if (confidence >= 0.6) return "Medium Confidence";
    return "Low Confidence";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">🏷️ Hashtag Performance</CardTitle>
          <Badge className={getConfidenceColor(insight.confidence)}>
            {getConfidenceLabel(insight.confidence)}
          </Badge>
        </div>
        <CardDescription>
          Analysis based on {insight.supportingData.sampleSize} posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <p className="text-sm font-medium text-green-900">{insight.recommendation}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="font-mono text-blue-600 font-medium">
              {insight.supportingData.hashtag}
            </span>
            <span className="text-sm text-green-600 font-medium">
              +{insight.supportingData.performanceBoost.toFixed(1)}% engagement
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">With Hashtag</h4>
              <div className="p-2 bg-green-50 rounded text-sm">
                <div>
                  Views: {insight.supportingData.comparisonData.withHashtag.avgViews.toFixed(0)}
                </div>
                <div>
                  Engagement:{" "}
                  {insight.supportingData.comparisonData.withHashtag.avgEngagement.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Without Hashtag</h4>
              <div className="p-2 bg-gray-50 rounded text-sm">
                <div>
                  Views: {insight.supportingData.comparisonData.withoutHashtag.avgViews.toFixed(0)}
                </div>
                <div>
                  Engagement:{" "}
                  {insight.supportingData.comparisonData.withoutHashtag.avgEngagement.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600">
            Used in {insight.supportingData.usageCount} posts
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
