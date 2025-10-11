import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PostTimingInsight as PostTimingInsightType } from "../../../../../features/analytics/api-type";
import { Badge } from "../../ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/Card";

type PostTimingInsightProps = {
  insight: PostTimingInsightType;
};

export const PostTimingInsight = ({ insight }: PostTimingInsightProps) => {
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

  // Show top 10 time slots for the chart
  const chartData = insight.supportingData.timeSlotData.slice(0, 10).map((slot) => ({
    ...slot,
    isOptimal: slot.timeSlot === insight.supportingData.optimalTimeSlot,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">⏰ Optimal Posting Time</CardTitle>
          <Badge className={getConfidenceColor(insight.confidence)}>
            {getConfidenceLabel(insight.confidence)}
          </Badge>
        </div>
        <CardDescription>
          Analysis based on {insight.supportingData.sampleSize} posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
          <p className="text-sm font-medium text-orange-900">{insight.recommendation}</p>
        </div>

        <div className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-orange-700">
              🎯 Best Time: {insight.supportingData.optimalTimeSlot}
            </span>
            <span className="text-sm text-green-600 font-medium">
              +{insight.supportingData.performanceBoost.toFixed(1)}% engagement
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
            <div>{insight.supportingData.postCount} posts</div>
            <div>{insight.supportingData.avgViews.toFixed(0)} avg views</div>
            <div>{insight.supportingData.avgEngagement.toFixed(1)}% avg engagement</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Performance by Time Slot</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timeSlot" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis />
              <Tooltip
                formatter={(value, _name) => [`${Number(value).toFixed(1)}%`, "Avg Engagement"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Bar dataKey="avgEngagement" fill="#6b7280" name="avgEngagement" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 text-center">
            Showing top 10 time slots by engagement. Orange bar indicates optimal time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
