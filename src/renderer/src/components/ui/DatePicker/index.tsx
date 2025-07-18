import { Button } from "@renderer/components/ui/Button";
import { Calendar } from "@renderer/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/Popover";
import { cn } from "@renderer/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

type DatePickerProps = {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
};

export const DatePicker = ({ date, setDate, placeholder }: DatePickerProps) => {
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
          {date ? format(date, "PPP") : <span>{placeholder || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
};
