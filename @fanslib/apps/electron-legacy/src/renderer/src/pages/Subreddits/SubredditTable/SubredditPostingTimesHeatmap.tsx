import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import type { SubredditPostingTime } from "../../../../../features/channels/api-type";

type SubredditPostingTimesHeatmapProps = {
  postingTimes: SubredditPostingTime[];
  timezone?: string;
  className?: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const getIntensityColor = (score: number): string => {
  if (score === 0) return "bg-gray-100";
  if (score <= 20) return "bg-green-200";
  if (score <= 40) return "bg-green-400";
  if (score <= 60) return "bg-amber-400";
  if (score <= 80) return "bg-orange-500";
  return "bg-red-600";
};

const formatHour = (hour: number): string => {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
};

export const SubredditPostingTimesHeatmap = ({
  postingTimes,
  timezone,
  className,
}: SubredditPostingTimesHeatmapProps) => {
  const heatmapData = useMemo(() => {
    // Create a lookup map for quick access
    const dataMap = new Map<string, SubredditPostingTime>();
    postingTimes.forEach((pt) => {
      const key = `${pt.day}-${pt.hour}`;
      dataMap.set(key, pt);
    });

    // Create grid data
    return DAYS.map((dayName, dayIndex) => ({
      day: dayName,
      dayIndex,
      hours: HOURS.map((hour) => {
        const key = `${dayIndex}-${hour}`;
        const data = dataMap.get(key);
        return {
          hour,
          score: data?.score || 0,
          posts: data?.posts || 0,
          formattedHour: formatHour(hour),
        };
      }),
    }));
  }, [postingTimes]);

  const maxScore = Math.max(...postingTimes.map((pt) => pt.score));
  const bestTime = postingTimes.find((pt) => pt.score === maxScore);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Optimal Posting Times</CardTitle>
        <CardDescription>
          {bestTime ? (
            <>
              Best time: {DAYS[bestTime.day]} at {formatHour(bestTime.hour)}
              {timezone && ` (${timezone})`}
            </>
          ) : (
            "No posting times data available"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {postingTimes.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-gray-500">
            Click &quot;Analyze Posting Times&quot; to view optimal posting schedule
          </div>
        ) : (
          <div className="space-y-2">
            {/* Hour labels */}
            <div className="grid grid-cols-[80px_repeat(24,1fr)] gap-1 text-xs">
              <div></div>
              {HOURS.map((hour) => (
                <div key={hour} className="text-center text-gray-600 text-[10px] font-mono">
                  {hour % 6 === 0 ? formatHour(hour) : ""}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            {heatmapData.map(({ day, dayIndex, hours }) => (
              <div key={dayIndex} className="grid grid-cols-[80px_repeat(24,1fr)] gap-1">
                <div className="text-sm font-medium text-gray-700 flex items-center">{day}</div>
                {hours.map(({ hour, score, posts }) => (
                  <div
                    key={hour}
                    className={`h-6 w-full ${getIntensityColor(score)} border border-gray-200 rounded-sm 
                               hover:ring-2 hover:ring-blue-300 transition-all cursor-help`}
                    title={`${day} ${formatHour(hour)}: ${posts} posts (Score: ${score})`}
                  />
                ))}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm"></div>
                <span className="text-gray-600">No data</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                <span className="text-gray-600">Low activity</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                <span className="text-gray-600">Medium activity</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                <span className="text-gray-600">High activity</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-2">
              Hover over cells to see detailed information. Higher scores indicate better posting
              times.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
