import { type FC } from "react";
import { Button } from "../../../components/ui/button";
import { PenLine, X } from "lucide-react";

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
      variant="ghost"
      size="icon"
      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={isEditing ? onCancel : onEdit}
    >
      {isEditing ? (
        <X className="h-4 w-4 text-muted-foreground" />
      ) : (
        <PenLine className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
};
