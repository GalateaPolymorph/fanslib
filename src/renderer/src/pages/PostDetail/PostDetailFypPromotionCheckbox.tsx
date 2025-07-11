import { Switch } from "@renderer/components/ui/switch";
import { useFieldUpdate } from "@renderer/hooks/forms/useFieldUpdate";
import { format } from "date-fns";
import { Post } from "src/features/posts/entity";

type PostDetailFypPromotionSwitchProps = {
  post: Post;
};

export const PostDetailFypPromotionSwitch = ({ post }: PostDetailFypPromotionSwitchProps) => {
  const { updateField, getCurrentValue, isUpdating } = useFieldUpdate<Date | null>({
    post,
    fieldName: "fypRemovedAt",
  });

  const currentValue = getCurrentValue();
  const isActiveOnFyp = currentValue === null;

  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      // Switch is ON (active on FYP), so set fypRemovedAt to null
      updateField(null);
    } else {
      // Switch is OFF (removed from FYP), so set fypRemovedAt to current date
      updateField(new Date());
    }
  };

  const formatRemovalDate = (date: Date | null) => {
    if (!date) return null;
    return format(new Date(date), "PPP");
  };

  return (
    <div className="flex items-center space-x-3 p-3">
      <div className="flex items-center space-x-2">
        <Switch
          id="fyp-promotion"
          checked={isActiveOnFyp}
          onCheckedChange={handleCheckedChange}
          disabled={isUpdating}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          htmlFor="fyp-promotion"
          className="text-base font-medium leading-none cursor-pointer"
        >
          FYP Promotion
        </label>
        {!isActiveOnFyp && currentValue ? (
          <span className="text-sm text-muted-foreground">
            Removed on {formatRemovalDate(currentValue)}
          </span>
        ) : null}
      </div>
    </div>
  );
};
