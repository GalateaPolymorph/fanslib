import { Calendar } from "@renderer/components/ui/calendar";
import { useToast } from "@renderer/components/ui/use-toast";
import { useDebounce } from "@renderer/hooks/useDebounce";
import { cn } from "@renderer/lib/utils";
import { useEffect, useState } from "react";
import { Post } from "src/features/posts/entity";

type PostDetailDateInputProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailDateInput = ({ post, onUpdate }: PostDetailDateInputProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const debouncedDate = useDebounce(selectedDate, 500);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedDate(new Date(post.date));
  }, [post.id, post.date]);

  useEffect(() => {
    const updateDate = async () => {
      if (!debouncedDate || debouncedDate.getTime() === new Date(post.date).getTime()) return;

      try {
        await window.api["post:update"](post.id, { date: debouncedDate.toISOString() });
        await onUpdate();

        toast({
          title: "Post date updated",
          duration: 2000,
        });
      } catch (err) {
        toast({
          title: "Failed to update post date",
          variant: "destructive",
        });
        console.error("Failed to update post date:", err);
        setSelectedDate(new Date(post.date));
      }
    };

    updateDate();
  }, [debouncedDate, post.id, post.date, onUpdate, toast]);

  const updateSelectedDate = (newDate: Date | undefined) => {
    if (!newDate) return;

    // Keep the original time when updating the date
    const updatedDate = new Date(newDate);
    if (selectedDate) {
      updatedDate.setHours(selectedDate.getHours());
      updatedDate.setMinutes(selectedDate.getMinutes());
      updatedDate.setSeconds(selectedDate.getSeconds());
    }

    setSelectedDate(updatedDate);
  };

  if (!selectedDate) return null;

  return (
    <div className="relative">
      <Calendar
        mode="single"
        selected={selectedDate}
        defaultMonth={selectedDate}
        onSelect={updateSelectedDate}
        selectedClassNames={cn({
          "bg-blue-500": post.status === "scheduled",
          "bg-green-500": post.status === "posted",
          "bg-gray-500": post.status === "draft",
        })}
      />
    </div>
  );
};
