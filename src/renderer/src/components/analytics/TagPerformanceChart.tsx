import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTagAnalytics } from "../../hooks/tags";

type TagPerformanceChartProps = {
  dimensionId?: number;
  timeRange?: { start: Date; end: Date };
};

export const TagPerformanceChart = ({ dimensionId, timeRange }: TagPerformanceChartProps) => {
  const { data: tagMetrics, isLoading } = useTagAnalytics({
    dimensionIds: dimensionId ? [dimensionId] : undefined,
    timeRange,
    metrics: ["engagement", "assignments"],
  });

  const chartData =
    tagMetrics?.map((metric) => ({
      name: metric.tagName,
      engagement: metric.averageEngagement,
      assignments: metric.totalAssignments,
      confidence: metric.confidenceScore,
    })) || [];

  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading tag performance data...</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-gray-500">No tag performance data available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="engagement" fill="#8884d8" name="Avg Engagement" />
          <Bar dataKey="assignments" fill="#82ca9d" name="Total Assignments" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
