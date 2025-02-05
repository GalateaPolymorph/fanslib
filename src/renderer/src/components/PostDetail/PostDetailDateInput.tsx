import { DateTimePicker } from "@renderer/components/DateTimePicker";
import { useToast } from "@renderer/components/ui/use-toast";
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

  const handleDateChange = async (newDate: Date) => {
    try {
      await window.api["post:update"](post.id, { date: newDate.toISOString() });
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
    }
  };

  return <DateTimePicker date={date} setDate={handleDateChange} />;
};
