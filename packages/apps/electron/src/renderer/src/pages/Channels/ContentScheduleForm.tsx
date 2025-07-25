import { Button } from "@renderer/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/Select";
import { Stepper } from "@renderer/components/ui/Stepper";
import cn from "classnames";
import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ContentScheduleCreateData } from "../../../../features/content-schedules/api-type";
import { ContentSchedule, parseMediaFilters } from "../../../../features/content-schedules/entity";
import { MediaFilters } from "../../../../features/library/api-type";
import { sanitizeFilterInput } from "../../../../features/library/filter-helpers";
import { MediaFilters as MediaFiltersComponent } from "../../components/MediaFilters/MediaFilters";
import { MediaFiltersProvider } from "../../components/MediaFilters/MediaFiltersContext";

type ContentScheduleFormProps = {
  schedule?: ContentSchedule;
  channelId: string;
  onSubmit: (schedule: ContentScheduleCreateData) => void;
  onCancel: () => void;
};

export const ContentScheduleForm = ({
  schedule,
  channelId,
  onSubmit,
  onCancel,
}: ContentScheduleFormProps) => {
  const [type, setType] = useState<ContentSchedule["type"]>(schedule?.type || "daily");

  // Initialize media filters from schedule
  const initialMediaFilters = useMemo(() => {
    return sanitizeFilterInput(parseMediaFilters(schedule?.mediaFilters));
  }, [schedule?.mediaFilters]);

  const [mediaFilters, setMediaFilters] = useState<MediaFilters>(initialMediaFilters);
  const [postsPerTimeframe, setPostsPerTimeframe] = useState(schedule?.postsPerTimeframe || 1);
  const [preferredDays, setPreferredDays] = useState<string[]>(
    schedule?.preferredDays?.map((d) => d.toString()) || []
  );
  const [preferredTimes, setPreferredTimes] = useState<string[]>(schedule?.preferredTimes || []);
  const [newTime, setNewTime] = useState("12:00");

  // Get the first day of the week based on locale (0 = Sunday, 1 = Monday, etc.)

  const firstDayOfWeek = (new Intl.Locale(navigator.language) as any).weekInfo?.firstDay || 0;

  // Create array of days starting from the locale's first day
  const days = [...Array(7)].map((_, i) => {
    const dayIndex = (i + firstDayOfWeek) % 7;
    return {
      label: new Intl.DateTimeFormat(navigator.language, { weekday: "short" }).format(
        new Date(2024, 0, dayIndex)
      ),
      index: dayIndex,
    };
  });

  const handleSubmit = () => {
    onSubmit({
      channelId,
      type,
      postsPerTimeframe,
      preferredTimes,
      mediaFilters: Object.keys(mediaFilters).length > 0 ? mediaFilters : undefined,
      ...(type !== "daily" ? { preferredDays } : {}),
    });
  };

  const handleDayToggle = (dayIndex: number) => {
    if (preferredDays.includes(dayIndex.toString())) {
      setPreferredDays(preferredDays.filter((d) => d !== dayIndex.toString()));
    } else if (preferredDays.length < postsPerTimeframe) {
      setPreferredDays([...preferredDays, dayIndex.toString()]);
    }
  };

  const handlePostsPerTimeframeChange = (value: number) => {
    setPostsPerTimeframe(value);
    // If reducing posts per timeframe, trim excess preferred days
    if (type !== "daily" && preferredDays.length > value) {
      setPreferredDays(preferredDays.slice(0, value));
    }
    // If reducing posts per timeframe, trim excess preferred times
    if (preferredTimes.length > value) {
      setPreferredTimes(preferredTimes.slice(0, value));
    }
  };

  const handleAddTime = () => {
    if (!preferredTimes.includes(newTime)) {
      setPreferredTimes((current) => [...current, newTime].sort());
    }
  };

  const handleRemoveTime = (time: string) => {
    setPreferredTimes((current) => current.filter((t) => t !== time));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="text-sm">Schedule Type</h4>
          <Select value={type} onValueChange={(value: ContentSchedule["type"]) => setType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm">
              Posts per {type === "daily" ? "day" : type === "weekly" ? "week" : "month"}
            </h4>
          </div>
          <Stepper
            min={1}
            max={type === "weekly" ? 7 : type === "monthly" ? 31 : 10}
            value={postsPerTimeframe}
            onChange={handlePostsPerTimeframeChange}
          />
        </div>

        {type !== "daily" && (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm">Preferred Days</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {days.map(({ label, index }) => {
                const isSelected = preferredDays.includes(index.toString());
                const canSelect = isSelected || preferredDays.length < postsPerTimeframe;

                return (
                  <Button
                    key={index}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleDayToggle(index)}
                    disabled={!isSelected && !canSelect}
                    className={!isSelected && !canSelect ? "opacity-50" : ""}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h4 className="text-sm">Preferred Times</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferredTimes.map((time) => (
              <Button
                key={time}
                size="sm"
                variant={type === "daily" ? "default" : "secondary"}
                onClick={() => handleRemoveTime(time)}
                className="gap-2"
              >
                {time}
                <X className="h-3 w-3" />
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button size="sm" variant="outline" onClick={handleAddTime} className={cn("gap-2")}>
              <Plus className="h-3 w-3" />
              Add Time
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm">Content Filters</h4>
        <p className="text-xs text-muted-foreground">
          Define which media should be eligible for this schedule. Only media matching these filters
          will be considered for posts.
        </p>
        <MediaFiltersProvider value={mediaFilters} onChange={setMediaFilters}>
          <MediaFiltersComponent />
        </MediaFiltersProvider>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>{schedule ? "Update" : "Create"} Schedule</Button>
      </div>
    </div>
  );
};
