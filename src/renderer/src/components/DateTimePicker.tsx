import { Button } from "@renderer/components/ui/button";
import { DatePicker } from "@renderer/components/ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TimePickerDemo } from "./TimePicker";

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
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
        <div className="grid gap-4 p-3">
          <DatePicker
            date={date}
            setDate={(newDate) => {
              if (newDate) {
                const updatedDate = new Date(newDate);
                updatedDate.setHours(date.getHours());
                updatedDate.setMinutes(date.getMinutes());
                setDate(updatedDate);
              }
            }}
          />
          <div className="p-3 border-t border-border">
            <TimePickerDemo
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
}