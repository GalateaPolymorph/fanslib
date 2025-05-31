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
import { createFilterGroup } from "../../../../../features/library/filter-helpers";
import { useLibraryPreferences } from "../../../contexts/LibraryPreferencesContext";
import { useHashtagAnalytics } from "../../../hooks/analytics/useHashtagAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold">{data.hashtag}</p>
        <p className="text-blue-600">Avg Views: {data.avgViews.toLocaleString()}</p>
        <p className="text-green-600">Avg Engagement: {data.avgEngagement.toFixed(1)}%</p>
        <p className="text-gray-600">Used in {data.postCount} posts</p>
        <p className="text-xs text-gray-500 mt-1">Click to filter library by this hashtag</p>
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload, onClick } = props;
  if (!payload) return null;

  // Scale bubble size based on post count (min 4, max 20)
  const minSize = 4;
  const maxSize = 20;
  const maxPostCount = Math.max(...(props.data || []).map((item: any) => item.postCount || 1));
  const size = minSize + ((payload.postCount - 1) / (maxPostCount - 1)) * (maxSize - minSize);

  return (
    <circle
      cx={cx}
      cy={cy}
      r={size}
      fill="#3b82f6"
      fillOpacity={0.7}
      stroke="#1e40af"
      strokeWidth={1}
      style={{ cursor: "pointer" }}
      onClick={() => onClick && onClick(payload)}
    />
  );
};

export const HashtagPerformanceHeatmap = () => {
  const { data: hashtagData, isLoading, error } = useHashtagAnalytics();
  const navigate = useNavigate();
  const { updatePreferences } = useLibraryPreferences();

  const handleBubbleClick = (data: any) => {
    if (data && data.hashtag) {
      // Update library preferences to search for the hashtag in captions
      updatePreferences({
        filter: [createFilterGroup(true, [{ type: "caption", value: data.hashtag }])],
        pagination: {
          page: 1,
        },
      });
      // Navigate to library page
      navigate("/");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hashtag Performance</CardTitle>
          <CardDescription>Performance metrics by hashtag usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p>Loading hashtag data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hashtag Performance</CardTitle>
          <CardDescription>Performance metrics by hashtag usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500">Error loading hashtag data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hashtagData || hashtagData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hashtag Performance</CardTitle>
          <CardDescription>Performance metrics by hashtag usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">No hashtag data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use top 20 hashtags for better readability
  const topHashtags = hashtagData.slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hashtag Performance</CardTitle>
        <CardDescription>
          Views vs Engagement by hashtag. Bubble size represents frequency of use. Click to filter
          library.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart data={topHashtags} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="avgViews"
              name="Avg Views"
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              type="number"
              dataKey="avgEngagement"
              name="Avg Engagement %"
              domain={[55, 65]}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              dataKey="avgEngagement"
              shape={<CustomDot data={topHashtags} onClick={handleBubbleClick} />}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Larger bubbles = used in more posts. Top-right position = high views and engagement.
            Click to filter library by hashtag.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
