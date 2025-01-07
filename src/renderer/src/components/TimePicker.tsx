import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { cn } from "@renderer/lib/utils";
import React from "react";

type TimePickerProps = {
  date: Date;
  setDate: (hours: number, minutes: number) => void;
  className?: string;
};

export const TimePicker = ({ date, setDate, className }: TimePickerProps) => {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <Input
          id="hours"
          className="w-16 text-center"
          defaultValue={date.getHours().toString().padStart(2, "0")}
          onChange={(e) => {
            const hours = parseInt(e.target.value);
            if (hours >= 0 && hours < 24) {
              setDate(hours, date.getMinutes());
            }
          }}
          ref={hourRef}
          type="number"
          min={0}
          max={23}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <Input
          id="minutes"
          className="w-16 text-center"
          defaultValue={date.getMinutes().toString().padStart(2, "0")}
          onChange={(e) => {
            const minutes = parseInt(e.target.value);
            if (minutes >= 0 && minutes < 60) {
              setDate(date.getHours(), minutes);
            }
          }}
          ref={minuteRef}
          type="number"
          min={0}
          max={59}
        />
      </div>
    </div>
  );
};
