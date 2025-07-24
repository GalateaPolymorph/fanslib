import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeClock } from "@mui/x-date-pickers/TimeClock";
import type { TimeView } from "@mui/x-date-pickers/models";
import { cn } from "@renderer/lib/utils";
import { addHours, format, startOfHour } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/Dialog";

type TimePickerProps = {
  date: Date;
  setDate: (hours: number, minutes: number) => void;
  className?: string;
  preferredTimes?: string[];
};

type ClockView = "hours" | "minutes";

export const TimePicker = ({ date, setDate, className, preferredTimes = [] }: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [view, setView] = useState<ClockView>("hours");

  const openModal = () => {
    setTempDate(date);
    setView("hours");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTempDate(null);
    setView("hours");
  };

  const timeChanged = (newValue: Date | null) => {
    if (!newValue) return;
    setTempDate(newValue);

    // Automatically switch to minutes after selecting hours
    if (view === "hours") {
      setView("minutes");
    }
  };

  const confirmTime = () => {
    if (!tempDate) return;
    setDate(tempDate.getHours(), tempDate.getMinutes());
    closeModal();
  };

  const setTimeFromString = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setTempDate(newDate);
    setView("hours");
  };

  const setToNow = () => {
    const now = new Date();
    const newDate = new Date(date);
    newDate.setHours(now.getHours());
    newDate.setMinutes(now.getMinutes());
    setTempDate(newDate);
  };

  const setToNextHour = () => {
    const now = new Date();
    const nextHour = addHours(startOfHour(now), 1);
    const newDate = new Date(date);
    newDate.setHours(nextHour.getHours());
    newDate.setMinutes(nextHour.getMinutes());
    setTempDate(newDate);
  };

  const currentTime = format(date, "HH:mm");

  return (
    <div className={cn(className)}>
      <Button variant="outline" onClick={openModal} className="w-full">
        {currentTime}
      </Button>

      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Time</DialogTitle>
          </DialogHeader>

          <span className="text-5xl font-bold text-muted-foreground/50 text-center">
            <button
              onClick={() => setView("hours")}
              className="hover:bg-muted hover:text-foreground rounded-sm p-1 transition-all cursor-pointer"
            >
              {tempDate ? format(tempDate, "HH") : "--"}
            </button>
            :
            <button
              onClick={() => setView("minutes")}
              className="hover:bg-muted hover:text-foreground rounded-sm p-1 transition-all cursor-pointer"
            >
              {tempDate ? format(tempDate, "mm") : "--"}
            </button>
          </span>

          <div className="flex items-center justify-center">
            <div className={cn("flex flex-col items-center", view === "hours" && "pb-8")}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimeClock
                  value={tempDate}
                  onChange={timeChanged}
                  ampm={false}
                  views={["hours", "minutes"]}
                  view={view}
                  onViewChange={(newView: TimeView) => {
                    if (newView === "hours" || newView === "minutes") {
                      setView(newView);
                    }
                  }}
                  sx={{
                    "& .MuiClock-pin": {
                      backgroundColor: "hsl(var(--primary))",
                    },
                    "& .MuiClockPointer-root": {
                      backgroundColor: "hsl(var(--primary))",
                    },
                    "& .MuiClockPointer-thumb": {
                      backgroundColor: "hsl(var(--primary))",
                      borderColor: "hsl(var(--primary))",
                    },
                    "& .MuiClock-clock": {
                      backgroundColor: "hsl(var(--muted))",
                    },
                    "& .MuiClockNumber-root.Mui-selected": {
                      backgroundColor: "hsl(var(--primary))",
                    },
                  }}
                />
              </LocalizationProvider>
              {view === "minutes" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setView("hours")}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="mr-1 h-3 w-3" />
                  Hours
                </Button>
              )}
            </div>
            {preferredTimes.length > 0 && (
              <div className="flex flex-col items-end gap-3 w-full">
                <span className="text-sm text-muted-foreground text-right">Quick select</span>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button size="sm" variant="outline" onClick={setToNow}>
                    Now
                  </Button>
                  <Button size="sm" variant="outline" onClick={setToNextHour}>
                    Next hour
                  </Button>
                  <div className="w-full border-t my-2" />
                  {preferredTimes.map((time) => (
                    <Button
                      key={time}
                      size="sm"
                      variant={time === currentTime ? "default" : "outline"}
                      onClick={() => setTimeFromString(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={confirmTime} disabled={!tempDate}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
