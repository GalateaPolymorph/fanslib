import { Button } from "@renderer/components/ui/Button";
import { Calendar } from "@renderer/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/Popover";
import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TimePicker } from "./TimePicker";

type DateTimePickerProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export const DateTimePicker = ({ date, setDate }: DateTimePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-4 p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                const updatedDate = new Date(newDate);
                updatedDate.setHours(date.getHours());
                updatedDate.setMinutes(date.getMinutes());
                setDate(updatedDate);
              }
            }}
            autoFocus
          />
          <div className="border-t border-border pt-3">
            <TimePicker
              setDate={(hours: number, minutes: number) => {
                const newDate = new Date(date);
                newDate.setHours(hours);
                newDate.setMinutes(minutes);
                setDate(newDate);
              }}
              date={date}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
