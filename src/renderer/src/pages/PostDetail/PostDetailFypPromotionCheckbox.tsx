import { Switch } from "@renderer/components/ui/switch";
import { useFieldUpdate } from "@renderer/hooks/forms/useFieldUpdate";
import { Post } from "src/features/posts/entity";

type PostDetailFypPromotionSwitchProps = {
  post: Post;
};

export const PostDetailFypPromotionSwitch = ({ post }: PostDetailFypPromotionSwitchProps) => {
  const { updateField, getCurrentValue, isUpdating } = useFieldUpdate<boolean>({
    post,
    fieldName: "fypPromotion",
  });

  const currentValue = getCurrentValue() ?? false;

  const handleCheckedChange = (checked: boolean) => {
    updateField(checked);
  };

  return (
    <div className="flex items-center space-x-3 p-3">
      <div className="flex items-center space-x-2">
        <Switch
          id="fyp-promotion"
          checked={currentValue}
          onCheckedChange={handleCheckedChange}
          disabled={isUpdating}
        />
      </div>
      <div className="flex gap-2">
        <label
          htmlFor="fyp-promotion"
          className="text-base font-medium leading-none cursor-pointer"
        >
          FYP Promotion
        </label>
      </div>
    </div>
  );
};
