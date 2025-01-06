import { type FC, useState } from "react";
import { ShootWithMedia } from "../../../../features/shoots/api-type";
import { Input } from "../ui/input";

type ShootDetailTitleProps = {
  shoot: ShootWithMedia;
  isEditing: boolean;
  onUpdate?: () => void;
  onCancel: () => void;
};

export const ShootDetailTitle: FC<ShootDetailTitleProps> = ({
  shoot,
  isEditing,
  onUpdate,
  onCancel,
}) => {
  const [newName, setNewName] = useState(shoot.name);

  const handleSaveName = async (name: string) => {
    await window.api["shoot:update"](shoot.id, { name });
    onUpdate?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (newName.trim() === "") return;
      handleSaveName(newName);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="font-normal"
        />
      </div>
    );
  }

  return shoot.name;
};
