import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFanslyPostsWithAnalytics } from "../../../hooks/analytics/useFanslyPostsWithAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/Card";

type LengthRangeData = {
  range: string;
  avgViews: number;
  avgEngagement: number;
  postCount: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-blue-600">Avg Views: {data.avgViews.toLocaleString()}</p>
        <p className="text-green-600">Avg Engagement: {data.avgEngagement.toFixed(1)}%</p>
        <p className="text-gray-600">Posts: {data.postCount}</p>
      </div>
    );
  }
  return null;
};

export const OptimalLengthChart = () => {
  const { data: posts, isLoading, error } = useFanslyPostsWithAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Optimal Video Length</CardTitle>
          <CardDescription>Performance trends by video length</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Optimal Video Length</CardTitle>
          <CardDescription>Performance trends by video length</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500">Error loading chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getLengthRange = (duration: number): string => {
    if (duration <= 4) return "0-4s";
    if (duration <= 5) return "4-5s";
    if (duration <= 6) return "5-6s";
    if (duration <= 7) return "6-7s";
    if (duration <= 8) return "7-8s";
    if (duration <= 9) return "8-9s";
    if (duration <= 10) return "9-10s";
    if (duration <= 11) return "10-11s";
    if (duration <= 12) return "11-12s";
    if (duration <= 14) return "12-14s";
    return "14s+";
  };

  const lengthRanges = new Map<
    string,
    { totalViews: number; totalEngagement: number; count: number }
  >();

  posts?.forEach((post) => {
    const range = getLengthRange(post.videoLength);
    const existing = lengthRanges.get(range) || { totalViews: 0, totalEngagement: 0, count: 0 };
    lengthRanges.set(range, {
      totalViews: existing.totalViews + post.totalViews,
      totalEngagement: existing.totalEngagement + post.averageEngagementPercent,
      count: existing.count + 1,
    });
  });

  const chartData: LengthRangeData[] = Array.from(lengthRanges.entries())
    .map(([range, data]) => ({
      range,
      avgViews: data.totalViews / data.count,
      avgEngagement: data.totalEngagement / data.count,
      postCount: data.count,
    }))
    .sort((a, b) => {
      const order = [
        "0-4s",
        "4-5s",
        "5-6s",
        "6-7s",
        "7-8s",
        "8-9s",
        "9-10s",
        "10-11s",
        "11-12s",
        "12-14s",
        "14s+",
      ];
      return order.indexOf(a.range) - order.indexOf(b.range);
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimal Video Length</CardTitle>
        <CardDescription>Performance trends across different video length ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis
              yAxisId="views"
              orientation="left"
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              yAxisId="engagement"
              orientation="right"
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="views"
              type="monotone"
              dataKey="avgViews"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              name="Avg Views"
            />
            <Line
              yAxisId="engagement"
              type="monotone"
              dataKey="avgEngagement"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              name="Avg Engagement %"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
