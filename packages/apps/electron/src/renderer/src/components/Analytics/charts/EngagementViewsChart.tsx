import { useFanslyPostsWithAnalytics } from "@renderer/hooks/analytics/useFanslyPostsWithAnalytics";
import { useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/Card";

type ChartDataPoint = {
  x: number; // views
  y: number; // engagement percent
  caption: string;
  id: string;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold text-sm">{data.caption.substring(0, 50)}...</p>
        <p className="text-blue-600">Views: {data.x.toLocaleString()}</p>
        <p className="text-green-600">Engagement: {data.y.toFixed(1)}%</p>
        <p className="text-xs text-gray-500 mt-1">Click to view post details</p>
      </div>
    );
  }
  return null;
};

export const EngagementViewsChart = () => {
  const { data: posts, isLoading, error } = useFanslyPostsWithAnalytics();
  const navigate = useNavigate();

  const handleDotClick = (data: any) => {
    if (data && data.id) {
      navigate(`/posts/${data.id}`);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement vs Views</CardTitle>
          <CardDescription>Correlation between post views and engagement rates</CardDescription>
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
          <CardTitle>Engagement vs Views</CardTitle>
          <CardDescription>Correlation between post views and engagement rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500">Error loading chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData: ChartDataPoint[] =
    posts?.map((post) => ({
      x: post.totalViews,
      y: post.averageEngagementPercent,
      caption: post.caption || "No caption",
      id: post.id,
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement vs Views</CardTitle>
        <CardDescription>
          Correlation between post views and engagement rates. Click any dot to view post details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Views"
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Engagement %"
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              dataKey="y"
              fill="#3b82f6"
              style={{ cursor: "pointer" }}
              onClick={handleDotClick}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
