import { TimePicker } from "@renderer/components/TimePicker";
import { Button } from "@renderer/components/ui/button";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ContentSchedule } from "../../../../features/content-schedules/entity";
import { Post } from "../../../../features/posts/entity";

type PostDetailTimeInputProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailTimeInput = ({ post, onUpdate }: PostDetailTimeInputProps) => {
  const [schedules, setSchedules] = useState<ContentSchedule[]>([]);

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

  const updateTime = async (hours: number, minutes: number) => {
    const newDate = new Date(post.date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    await window.api["post:update"](post.id, { date: newDate.toISOString() });
    await onUpdate();
  };

  const setTimeFromString = async (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    await updateTime(hours, minutes);
  };

  // Get unique preferred times from all schedules
  const preferredTimes = Array.from(
    new Set(schedules.flatMap((schedule) => schedule.preferredTimes))
  ).sort();

  const currentTime = format(new Date(post.date), "HH:mm");

  return (
    <div className="flex flex-col gap-2 pt-11">
      <span className="text-sm">Channel preferred times</span>
      <div className="flex flex-wrap gap-2">
        {preferredTimes.map((time) => (
          <Button
            key={time}
            size="sm"
            variant={time === currentTime ? "default" : "outline"}
            onClick={() => setTimeFromString(time)}
          >
            {time}
          </Button>
        ))}
      </div>
      <span className="text-sm mt-2">or custom</span>
      <TimePicker
        noLabel
        date={new Date(post.date)}
        setDate={(hours, minutes) => updateTime(hours, minutes)}
      />
    </div>
  );
};
