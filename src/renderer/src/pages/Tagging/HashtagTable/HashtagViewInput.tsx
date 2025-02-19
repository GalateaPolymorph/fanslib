import { useState } from "react";
import { Input } from "../../../components/ui/input";
import { formatViewCount, parseViewCount } from "../../../lib/format-views";

type HashtagViewInputProps = {
  initialValue: number;
  onViewCountChange: (newValue: number) => void;
  disabled?: boolean;
};

export const HashtagViewInput = ({
  initialValue,
  onViewCountChange,
  disabled = false,
}: HashtagViewInputProps) => {
  const [value, setValue] = useState(formatViewCount(initialValue));
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    if (disabled) return;
    setIsEditing(true);
    setValue(formatViewCount(initialValue));
  };

  const commitEdit = () => {
    if (!isEditing) return;

    const parsedValue = parseViewCount(value);
    if (parsedValue === null) {
      setValue(formatViewCount(initialValue));
    } else {
      onViewCountChange(parsedValue);
    }
    setIsEditing(false);
  };

  return (
    <Input
      value={value}
      variant="ghost"
      disabled={disabled}
      onFocus={startEditing}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commitEdit}
      className="text-center"
    />
  );
};
