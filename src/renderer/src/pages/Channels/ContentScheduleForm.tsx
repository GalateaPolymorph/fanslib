import { Button } from "@renderer/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select";
import { Stepper } from "@renderer/components/ui/stepper";
import { useState } from "react";
import { ContentSchedule } from "../../../../lib/database/content-schedules/type";
import { CategorySelect } from "../../components/CategorySelect";

interface ContentScheduleFormProps {
  schedule?: ContentSchedule;
  existingSchedules: ContentSchedule[];
  onSubmit: (schedule: Omit<ContentSchedule, "id" | "channelId">) => void;
  onCancel: () => void;
}

export const ContentScheduleForm = ({
  schedule,
  existingSchedules,
  onSubmit,
  onCancel,
}: ContentScheduleFormProps) => {
  const [type, setType] = useState<ContentSchedule["type"]>(schedule?.type || "daily");
  const [categorySlug, setCategorySlug] = useState<string[]>(
    schedule?.categorySlug ? [schedule.categorySlug] : []
  );
  const [postsPerTimeframe, setPostsPerTimeframe] = useState(schedule?.postsPerTimeframe || 1);
  const [preferredDays, setPreferredDays] = useState<number[]>(schedule?.preferredDays || []);

  const disabledCategories = existingSchedules
    .filter((s) => s.id !== schedule?.id)
    .map((s) => s.categorySlug);

  const handleSubmit = () => {
    if (categorySlug.length === 0) return;

    const schedule: Omit<ContentSchedule, "id" | "channelId"> = {
      categorySlug: categorySlug[0],
      type,
      postsPerTimeframe,
      ...(type !== "daily" ? { preferredDays } : {}),
    };

    onSubmit(schedule);
  };

  const getTimeframeLabel = () => {
    switch (type) {
      case "daily":
        return "day";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    if (preferredDays.includes(dayIndex)) {
      setPreferredDays(preferredDays.filter((d) => d !== dayIndex));
    } else if (preferredDays.length < postsPerTimeframe) {
      setPreferredDays([...preferredDays, dayIndex]);
    }
  };

  // Reset preferred days if posts per timeframe is reduced
  const handlePostsPerTimeframeChange = (value: number) => {
    setPostsPerTimeframe(value);
    if (preferredDays.length > value) {
      setPreferredDays(preferredDays.slice(0, value));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="text-sm">Category</h4>
          <CategorySelect
            value={categorySlug}
            onChange={setCategorySlug}
            multiple={false}
            disabledCategories={disabledCategories}
          />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm">Schedule Type</h4>
          <Select value={type} onValueChange={(v) => setType(v as ContentSchedule["type"])}>
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
          <h4 className="text-sm">Posts per {getTimeframeLabel()}</h4>
          <Stepper
            value={postsPerTimeframe}
            onChange={handlePostsPerTimeframeChange}
            min={1}
            max={type === "weekly" ? 7 : type === "monthly" ? 31 : undefined}
          />
        </div>
        <div> </div>

        {type !== "daily" && (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h4 className="text-sm">Preferred Days</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
                const isSelected = preferredDays.includes(index);
                const canSelect = isSelected || preferredDays.length < postsPerTimeframe;

                return (
                  <Button
                    key={day}
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleDayToggle(index)}
                    disabled={!isSelected && !canSelect}
                    className={!isSelected && !canSelect ? "opacity-50" : ""}
                  >
                    {day}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={categorySlug.length === 0}>
          Save
        </Button>
      </div>
    </div>
  );
};
