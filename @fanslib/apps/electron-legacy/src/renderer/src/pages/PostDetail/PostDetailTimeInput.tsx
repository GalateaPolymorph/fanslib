import { TimePicker } from "@renderer/components/TimePicker";
import { useFieldUpdate } from "@renderer/hooks/forms/useFieldUpdate";
import { useEffect, useState } from "react";
import { ContentSchedule } from "../../../../features/content-schedules/entity";
import { Post } from "../../../../features/posts/entity";

type PostDetailTimeInputProps = {
  post: Post;
};

export const PostDetailTimeInput = ({ post }: PostDetailTimeInputProps) => {
  const [schedules, setSchedules] = useState<ContentSchedule[]>([]);

  const { updateField, getCurrentValue, isUpdating } = useFieldUpdate<Date>({
    post,
    fieldName: "date",
    transform: (date: Date) => date.toISOString(),
    debounceMs: 300,
  });

  const currentDate = getCurrentValue();
  const selectedDate = currentDate ? new Date(currentDate) : new Date(post.date);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const channelSchedules = await window.api["content-schedule:getByChannel"](post.channel.id);
        setSchedules(channelSchedules);
      } catch (error) {
        console.error("Failed to load content schedules:", error);
      }
    };

    loadSchedules();
  }, [post.channel.id]);

  const updateTime = (hours: number, minutes: number) => {
    if (isUpdating) return;

    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);

    updateField(newDate);
  };

  const preferredTimes = Array.from(
    new Set(schedules.flatMap((schedule) => schedule.preferredTimes))
  ).sort();

  return (
    <div className="flex flex-col gap-2 pt-4">
      <label className="text-sm font-medium">Time</label>
      <div className="relative">
        <TimePicker
          date={selectedDate}
          setDate={(hours, minutes) => updateTime(hours, minutes)}
          preferredTimes={preferredTimes}
        />
        {isUpdating && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded">
            <div className="text-xs text-muted-foreground">Updating...</div>
          </div>
        )}
      </div>
    </div>
  );
};
