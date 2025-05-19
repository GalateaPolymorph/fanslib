import { TimePicker } from "@renderer/components/TimePicker";
import { useToast } from "@renderer/components/ui/use-toast";
import { useDebounce } from "@renderer/hooks/useDebounce";
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
  }, [post.id]);

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
      const currentPostDate = new Date(post.date);
      if (debouncedDate.getTime() === currentPostDate.getTime()) return;

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
  }, [debouncedDate, post.id, onUpdate, toast]);

  const updateTime = (hours: number, minutes: number) => {
    const newDate = new Date(selectedDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setSelectedDate(newDate);
  };

  const preferredTimes = Array.from(
    new Set(schedules.flatMap((schedule) => schedule.preferredTimes))
  ).sort();

  return (
    <div className="flex flex-col gap-2 pt-4">
      <label className="text-sm font-medium">Time</label>
      <TimePicker
        date={selectedDate}
        setDate={(hours, minutes) => updateTime(hours, minutes)}
        preferredTimes={preferredTimes}
      />
    </div>
  );
};
