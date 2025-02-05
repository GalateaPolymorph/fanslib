import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { cn } from "@renderer/lib/utils";
import React from "react";

type TimePickerProps = {
  date: Date;
  setDate: (hours: number, minutes: number) => void;
  hourLabel?: string;
  minuteLabel?: string;
  noLabel?: boolean;
  className?: string;
};

export const TimePicker = ({
  date,
  setDate,
  hourLabel,
  minuteLabel,
  noLabel,
  className,
}: TimePickerProps) => {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="grid gap-1 text-center">
        {!noLabel && (
          <Label htmlFor="hours" className="text-xs">
            {hourLabel ?? "Hours"}
          </Label>
        )}
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
        {!noLabel && (
          <Label htmlFor="minutes" className="text-xs">
            {minuteLabel ?? "Minutes"}
          </Label>
        )}
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
