import { Check, PenLine } from "lucide-react";
import { type FC } from "react";
import { Button } from "../ui/button";

type ShootDetailEditButtonProps = {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
};

export const ShootDetailEditButton: FC<ShootDetailEditButtonProps> = ({
  isEditing,
  onEdit,
  onCancel,
}) => {
  return (
    <Button
      variant={!isEditing ? "outline" : "default"}
      onClick={isEditing ? onCancel : onEdit}
      className="text-sm"
    >
      {isEditing ? <Check /> : <PenLine />}
      {isEditing ? "Save" : "Edit"}
    </Button>
  );
};
