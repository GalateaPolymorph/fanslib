import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isSameDay,
  isToday,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { de } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";
import { PostCalendarPost } from "./PostCalendarPost";

type PostCalendarProps = {
  className?: string;
  posts: Post[];
};

export const PostCalendar = ({ className, posts }: PostCalendar) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  // Get locale-specific week start
  const weekStart = startOfWeek(firstDayCurrentMonth, { locale: de });
  const weekEnd = endOfWeek(firstDayCurrentMonth, { locale: de });

  // Get weekday names in locale order
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((day) =>
    format(day, "EEEEE", { locale: de })
  );

  const days = eachDayOfInterval({
    start: startOfMonth(firstDayCurrentMonth),
    end: endOfMonth(firstDayCurrentMonth),
  });

  const previousMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  // Get the day offset based on locale's start of week
  const getDayOffset = (date: Date) => {
    const firstDayOffset = getDay(weekStart);
    const currentDayOffset = getDay(date);
    return (currentDayOffset - firstDayOffset + 7) % 7;
  };

  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div className="flex items-center justify-between flex-none">
        <h2 className="font-semibold">{format(firstDayCurrentMonth, "MMMM yyyy")}</h2>
        <div className="space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 mt-6 text-xs leading-6 text-center text-gray-500 flex-none">
        {weekDays.map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 mt-2 text-sm flex-1 min-h-0">
        {days.map((day, dayIdx) => {
          const dayPosts = posts.filter((post) => isSameDay(new Date(post.date), day));

          return (
            <div
              key={day.toString()}
              className={cn(
                dayIdx === 0 && colStartClasses[getDayOffset(day)],
                "py-2 px-1 flex flex-col min-h-0"
              )}
            >
              <button
                type="button"
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full flex-none",
                  isToday(day) && "text-white bg-primary"
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
              </button>
              {dayPosts.length > 0 && (
                <ScrollArea className="flex-1 mt-1 min-h-0">
                  {dayPosts.map((post) => (
                    <PostCalendarPost key={post.id} post={post} />
                  ))}
                </ScrollArea>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
