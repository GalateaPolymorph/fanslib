import { Calendar } from "@renderer/components/ui/Calendar";
import { useFieldUpdate } from "@renderer/hooks/forms/useFieldUpdate";
import { cn } from "@renderer/lib/utils";
import { Post } from "src/features/posts/entity";

type PostDetailDateInputProps = {
  post: Post;
};

export const PostDetailDateInput = ({ post }: PostDetailDateInputProps) => {
  const { updateField, getCurrentValue, isUpdating } = useFieldUpdate<Date>({
    post,
    fieldName: "date",
    transform: (date: Date) => date.toISOString(),
    debounceMs: 300,
  });

  const currentDate = getCurrentValue();
  const selectedDate = currentDate ? new Date(currentDate) : new Date(post.date);

  const updateSelectedDate = (newDate: Date | undefined) => {
    if (!newDate) return;

    // Keep the original time when updating the date
    const updatedDate = new Date(newDate);
    const originalDate = new Date(post.date);

    updatedDate.setHours(originalDate.getHours());
    updatedDate.setMinutes(originalDate.getMinutes());
    updatedDate.setSeconds(originalDate.getSeconds());
    updatedDate.setMilliseconds(originalDate.getMilliseconds());

    updateField(updatedDate);
  };

  return (
    <div className="relative">
      <Calendar
        mode="single"
        selected={selectedDate}
        defaultMonth={selectedDate}
        onSelect={updateSelectedDate}
        disabled={isUpdating}
        selectedClassNames={cn({
          "bg-blue-500": post.status === "scheduled",
          "bg-green-500": post.status === "posted",
          "bg-gray-500": post.status === "draft",
        })}
      />
      {isUpdating && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Updating...</div>
        </div>
      )}
    </div>
  );
};
