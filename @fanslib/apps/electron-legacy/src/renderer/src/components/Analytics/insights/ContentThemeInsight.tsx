import { ContentThemeInsight as ContentThemeInsightType } from "../../../../../features/analytics/api-type";
import { Badge } from "../../ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/Card";

type ContentThemeInsightProps = {
  insight: ContentThemeInsightType;
};

export const ContentThemeInsight = ({ insight }: ContentThemeInsightProps) => {
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
          <CardTitle className="text-lg">💭 Content Theme Performance</CardTitle>
          <Badge className={getConfidenceColor(insight.confidence)}>
            {getConfidenceLabel(insight.confidence)}
          </Badge>
        </div>
        <CardDescription>
          Analysis based on {insight.supportingData.sampleSize} posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <p className="text-sm font-medium text-purple-900">{insight.recommendation}</p>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-purple-600 capitalize">
                &ldquo;{insight.supportingData.theme}&rdquo; content
              </span>
              <span className="text-sm text-green-600 font-medium">
                +{insight.supportingData.performanceBoost.toFixed(1)}% engagement
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {insight.supportingData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-medium">{insight.supportingData.postCount}</div>
              <div className="text-gray-600">Posts</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-medium">{insight.supportingData.avgViews.toFixed(0)}</div>
              <div className="text-gray-600">Avg Views</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="font-medium">{insight.supportingData.avgEngagement.toFixed(1)}%</div>
              <div className="text-gray-600">Avg Engagement</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
