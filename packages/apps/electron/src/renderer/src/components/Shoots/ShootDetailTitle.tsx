import { type FC, useState } from "react";
import { ShootWithMedia, UpdateShootPayload } from "../../../../features/shoots/api-type";
import { Input } from "../ui/Input";

type ShootDetailTitleProps = {
  shoot: ShootWithMedia;
  isEditing: boolean;
  onUpdate: (payload: UpdateShootPayload) => Promise<void>;
  onCancel: () => void;
};

export const ShootDetailTitle: FC<ShootDetailTitleProps> = ({
  shoot,
  isEditing,
  onUpdate,
  onCancel,
}) => {
  const [newName, setNewName] = useState(shoot.name);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (newName.trim() === "") return;
      onUpdate({ name: newName });
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
          onBlur={() => {
            if (newName.trim() === "") return;
            if (newName === shoot.name) return;
            onUpdate({ name: newName });
          }}
          onClick={(e) => e.stopPropagation()}
          autoFocus
          className="font-normal"
        />
      </div>
    );
  }

  return shoot.name;
};
