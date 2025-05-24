import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTimeAnalytics } from "../../../hooks/analytics/useTimeAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

const getPerformanceColor = (engagement: number, maxEngagement: number): string => {
  const intensity = engagement / maxEngagement;
  if (intensity > 0.8) return "#dc2626"; // red-600
  if (intensity > 0.6) return "#ea580c"; // orange-600
  if (intensity > 0.4) return "#d97706"; // amber-600
  if (intensity > 0.2) return "#16a34a"; // green-600
  return "#22c55e"; // green-500
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold">{data.timePeriod}</p>
        <p className="text-blue-600">Avg Views: {data.avgViews.toLocaleString()}</p>
        <p className="text-green-600">Avg Engagement: {data.avgEngagement.toFixed(1)}%</p>
        <p className="text-gray-600">{data.postCount} posts</p>
      </div>
    );
  }
  return null;
};

export const TimePerformanceHeatmap = () => {
  const { data: timeData, isLoading, error } = useTimeAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posting Time Performance</CardTitle>
          <CardDescription>Performance metrics by posting time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p>Loading time data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posting Time Performance</CardTitle>
          <CardDescription>Performance metrics by posting time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500">Error loading time data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!timeData || timeData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posting Time Performance</CardTitle>
          <CardDescription>Performance metrics by posting time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">No timing data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxEngagement = Math.max(...timeData.map((item) => item.avgEngagement));
  const topTimeSlots = timeData.slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posting Time Performance</CardTitle>
        <CardDescription>
          Performance by posting time. Color intensity indicates engagement level.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topTimeSlots} margin={{ top: 20, right: 30, bottom: 80, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timePeriod"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              fontSize={10}
            />
            <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgEngagement">
              {topTimeSlots.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getPerformanceColor(entry.avgEngagement, maxEngagement)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4">
          <div className="flex items-center justify-center gap-4 text-sm mb-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Low Engagement</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-600 rounded"></div>
              <span>Medium Engagement</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>High Engagement</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Showing top 20 time slots by engagement rate
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
