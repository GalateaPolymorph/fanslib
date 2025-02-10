import { TimePicker } from "@renderer/components/TimePicker";
import { Button } from "@renderer/components/ui/button";
import { useToast } from "@renderer/components/ui/use-toast";
import { useDebounce } from "@renderer/hooks/useDebounce";
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
  const [selectedDate, setSelectedDate] = useState(new Date(post.date));
  const debouncedDate = useDebounce(selectedDate, 500);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedDate(new Date(post.date));
  }, [post.date]);

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

  useEffect(() => {
    const updateDate = async () => {
      if (debouncedDate.getTime() === new Date(post.date).getTime()) return;

      try {
        await window.api["post:update"](post.id, { date: debouncedDate.toISOString() });
        await onUpdate();

        toast({
          title: "Post time updated",
          duration: 2000,
        });
      } catch (err) {
        toast({
          title: "Failed to update post time",
          variant: "destructive",
        });
        console.error("Failed to update post time:", err);
      }
    };

    updateDate();
  }, [debouncedDate, post.id, post.date, onUpdate, toast]);

  const updateTime = (hours: number, minutes: number) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setSelectedDate(newDate);
  };

  const setTimeFromString = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    updateTime(hours, minutes);
  };

  // Get unique preferred times from all schedules
  const preferredTimes = Array.from(
    new Set(schedules.flatMap((schedule) => schedule.preferredTimes))
  ).sort();

  const currentTime = format(selectedDate, "HH:mm");

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
        date={selectedDate}
        setDate={(hours, minutes) => updateTime(hours, minutes)}
      />
    </div>
  );
};
