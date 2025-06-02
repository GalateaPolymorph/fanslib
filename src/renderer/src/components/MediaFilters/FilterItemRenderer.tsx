import { format } from "date-fns";
import { CalendarIcon, ImageIcon, VideoIcon, X } from "lucide-react";
import { useState } from "react";
import { FilterItem } from "../../../../features/library/api-type";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ChannelFilterSelector } from "./ChannelFilterSelector";
import { ShootFilterSelector } from "./ShootFilterSelector";
import { SubredditFilterSelector } from "./SubredditFilterSelector";
import { TagFilterSelector } from "./TagFilterSelector";

type FilterItemRendererProps = {
  type: FilterItem["type"];
  value?: FilterItem;
  onChange: (item: FilterItem) => void;
  onRemove: () => void;
};

export const FilterItemRenderer = ({
  type,
  value,
  onChange,
  onRemove,
}: FilterItemRendererProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const renderInput = () => {
    switch (type) {
      case "channel":
        return (
          <ChannelFilterSelector
            value={value && "id" in value ? value.id : undefined}
            onChange={(channelId) => onChange({ type: "channel", id: channelId })}
          />
        );

      case "subreddit":
        return (
          <SubredditFilterSelector
            value={value && "id" in value ? value.id : undefined}
            onChange={(subredditId) => onChange({ type: "subreddit", id: subredditId })}
          />
        );

      case "tag":
        return (
          <TagFilterSelector
            value={value && "id" in value ? value.id : undefined}
            onChange={(tagId) => onChange({ type: "tag", id: tagId })}
          />
        );

      case "shoot":
        return (
          <ShootFilterSelector
            value={value && "id" in value ? value.id : undefined}
            onChange={(shootId) => onChange({ type: "shoot", id: shootId })}
          />
        );

      case "filename":
      case "caption":
        return (
          <Input
            value={value && "value" in value && typeof value.value === "string" ? value.value : ""}
            onChange={(e) => onChange({ type, value: e.target.value })}
            placeholder={`Enter ${type} text`}
          />
        );

      case "posted":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={
                value && "value" in value && typeof value.value === "boolean" ? value.value : false
              }
              onCheckedChange={(checked) => onChange({ type: "posted", value: checked })}
            />
            <span className="text-sm">
              {value && "value" in value && typeof value.value === "boolean" && value.value
                ? "Posted"
                : "Unposted"}
            </span>
          </div>
        );

      case "mediaType":
        return (
          <Select
            value={
              value && "value" in value && typeof value.value === "string" ? value.value : "image"
            }
            onValueChange={(mediaType: "image" | "video") =>
              onChange({ type: "mediaType", value: mediaType })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image
                </div>
              </SelectItem>
              <SelectItem value="video">
                <div className="flex items-center gap-2">
                  <VideoIcon className="h-4 w-4" />
                  Video
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        );

      case "createdDateStart":
      case "createdDateEnd": {
        const dateValue =
          value && "value" in value && value.value instanceof Date ? value.value : undefined;
        return (
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  if (date) {
                    onChange({ type, value: date });
                    setCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      }

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">{renderInput()}</div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="end"
          className="flex gap-1 bg-background border border-border px-1.5"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X size={14} />
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
