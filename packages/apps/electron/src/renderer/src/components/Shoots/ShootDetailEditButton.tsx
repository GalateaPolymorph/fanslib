import { PenLine, X } from "lucide-react";
import { type FC } from "react";
import { Button } from "../ui/Button";

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
    <Button variant={"outline"} onClick={isEditing ? onCancel : onEdit}>
      {isEditing ? <X /> : <PenLine />}
      {isEditing ? "Cancel" : "Edit"}
    </Button>
  );
};
