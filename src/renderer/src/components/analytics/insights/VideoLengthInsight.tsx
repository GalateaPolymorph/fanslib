import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { VideoLengthInsight as VideoLengthInsightType } from "../../../../../features/analytics/api-type";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

type VideoLengthInsightProps = {
  insight: VideoLengthInsightType;
};

export const VideoLengthInsight = ({ insight }: VideoLengthInsightProps) => {
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
          <CardTitle className="text-lg">📹 Optimal Video Length</CardTitle>
          <Badge className={getConfidenceColor(insight.confidence)}>
            {getConfidenceLabel(insight.confidence)}
          </Badge>
        </div>
        <CardDescription>
          Analysis based on {insight.supportingData.sampleSize} posts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm font-medium text-blue-900">{insight.recommendation}</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Performance by Length Range</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={insight.supportingData.performanceByRange}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}%`,
                  name === "avgEngagement" ? "Avg Engagement" : "Avg Views",
                ]}
              />
              <Bar dataKey="avgEngagement" fill="#3b82f6" name="avgEngagement" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Optimal Range:</span>{" "}
            {insight.supportingData.optimalRange[0]}-{insight.supportingData.optimalRange[1]}s
          </div>
          <div>
            <span className="font-medium">Sample Size:</span> {insight.supportingData.sampleSize}{" "}
            posts
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
