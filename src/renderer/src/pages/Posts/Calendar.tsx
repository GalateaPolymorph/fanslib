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
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CHANNEL_TYPES } from "../../../../features/channels/channelTypes";
import { ChannelTypeIcon } from "../../components/ChannelTypeIcon";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../components/ui/tooltip";
import { cn } from "../../lib/utils";
import { Post } from "../../../../features/posts/entity";

interface CalendarProps {
  className?: string;
  posts: Post[];
  loading?: boolean;
  selectedDate?: Date | null;
  onSelectDate?: (date: Date) => void;
}

export const Calendar = ({ className, posts, selectedDate, onSelectDate }: CalendarProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const navigate = useNavigate();

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
          const dayPosts = posts.filter((post) => isSameDay(new Date(post.scheduledDate), day));

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
                onClick={() => onSelectDate?.(day)}
                className={cn(
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full flex-none",
                  isToday(day) && "text-white bg-primary",
                  selectedDate && isSameDay(day, selectedDate) && "bg-primary/20",
                  !isToday(day) && !selectedDate && "hover:bg-primary/10",
                  (isToday(day) || selectedDate) && "font-semibold"
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
              </button>
              {dayPosts.length > 0 && (
                <ScrollArea className="flex-1 mt-1 min-h-0">
                  {dayPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => navigate(`/posts/${post.id}`)}
                      className="px-2 py-1.5 mx-1 mb-1 text-xs rounded bg-accent/50 hover:bg-accent/70 cursor-pointer"
                    >
                      <div className="font-medium flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {format(new Date(post.scheduledDate), "h:mm a")}
                          <span
                            className={cn(
                              "px-1 py-0.5 rounded-sm text-[10px] capitalize",
                              post.status === "planned" && "bg-yellow-500/20 text-yellow-700",
                              post.status === "scheduled" && "bg-blue-500/20 text-blue-700",
                              post.status === "posted" && "bg-green-500/20 text-green-700"
                            )}
                          >
                            {post.status}
                          </span>
                        </div>
                        {(!post.media || post.media.length === 0) && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="w-3 h-3 text-destructive" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>No media assigned</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        {post.channel && (
                          <div
                            className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-sm text-white"
                            style={{
                              backgroundColor:
                                CHANNEL_TYPES[post.channel.type.id as keyof typeof CHANNEL_TYPES]
                                  ?.color,
                            }}
                          >
                            <ChannelTypeIcon
                              color="white"
                              typeId={post.channel.type.id as keyof typeof CHANNEL_TYPES}
                              className="w-3 h-3 text-white"
                            />
                            <span>{post.channel.name}</span>
                          </div>
                        )}
                        {post.category && (
                          <div
                            className="px-1.5 py-0.5 text-[10px] rounded-sm text-white"
                            style={{ backgroundColor: post.category.color }}
                          >
                            {post.category.name}
                          </div>
                        )}
                      </div>
                    </div>
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
