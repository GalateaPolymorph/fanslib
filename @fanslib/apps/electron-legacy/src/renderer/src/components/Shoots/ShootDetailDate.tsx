import { format } from "date-fns";
import { type FC } from "react";
import { ShootWithMedia, UpdateShootPayload } from "../../../../features/shoots/api-type";
import { DateTimePicker } from "../DateTimePicker";

type ShootDetailDateProps = {
  shoot: ShootWithMedia;
  isEditing: boolean;
  onUpdate: (payload: UpdateShootPayload) => Promise<void>;
};

export const ShootDetailDate: FC<ShootDetailDateProps> = ({ shoot, isEditing, onUpdate }) => {
  if (isEditing) {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <DateTimePicker
          date={new Date(shoot.shootDate)}
          setDate={(date) => onUpdate({ shootDate: date })}
        />
      </div>
    );
  }

  return <span>{format(new Date(shoot.shootDate), "PPP")}</span>;
};
