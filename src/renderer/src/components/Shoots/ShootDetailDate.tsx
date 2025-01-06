import { format } from "date-fns";
import { type FC } from "react";
import { ShootWithMedia } from "../../../../features/shoots/api-type";
import { DateTimePicker } from "../DateTimePicker";

type ShootDetailDateProps = {
  shoot: ShootWithMedia;
  isEditing: boolean;
  onUpdate: () => void;
};

export const ShootDetailDate: FC<ShootDetailDateProps> = ({ shoot, isEditing, onUpdate }) => {
  const handleDateChange = async (newDate: Date) => {
    await window.api["shoot:update"](shoot.id, { shootDate: newDate });
    onUpdate();
  };

  if (isEditing) {
    return <DateTimePicker date={new Date(shoot.shootDate)} setDate={handleDateChange} />;
  }

  return <span>{format(new Date(shoot.shootDate), "PPP")}</span>;
};
