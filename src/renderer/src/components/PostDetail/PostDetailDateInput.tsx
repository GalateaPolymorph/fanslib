import { Calendar } from "@renderer/components/ui/calendar";
import { useToast } from "@renderer/components/ui/use-toast";
import { cn } from "@renderer/lib/utils";
import { useEffect, useState } from "react";
import { Post } from "src/features/posts/entity";

type PostDetailDateInputProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailDateInput = ({ post, onUpdate }: PostDetailDateInputProps) => {
  const [date, setDate] = useState(new Date(post.date));
  const { toast } = useToast();

  useEffect(() => {
    setDate(new Date(post.date));
  }, [post.date]);

  const handleDateChange = async (newDate: Date | undefined) => {
    if (!newDate) return;

    try {
      // Keep the original time when updating the date
      const updatedDate = new Date(newDate);
      updatedDate.setHours(date.getHours());
      updatedDate.setMinutes(date.getMinutes());
      updatedDate.setSeconds(date.getSeconds());

      await window.api["post:update"](post.id, { date: updatedDate.toISOString() });
      await onUpdate();
      setDate(updatedDate);

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
    }
  };

  return (
    <div className="relative">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateChange}
        selectedClassNames={cn({
          "bg-blue-500": post.status === "scheduled",
          "bg-green-500": post.status === "posted",
          "bg-gray-500": post.status === "draft",
        })}
      />
    </div>
  );
};
