import { formatViewCount } from "@renderer/lib/format-views";
import { cn } from "@renderer/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Subreddit } from "src/features/channels/subreddit";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type SubredditSelectProps = {
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
};

export const SubredditSelect = ({ value, onChange, multiple = false }: SubredditSelectProps) => {
  const [open, setOpen] = useState(false);
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(subreddits);

  const loadSubreddits = async () => {
    try {
      setIsLoading(true);
      const fetchedSubreddits = await window.api["channel:subreddit-list"]();
      setSubreddits(fetchedSubreddits);
    } catch (error) {
      console.error("Failed to load subreddits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubreddits();
  }, []);

  const selectedSubreddits = subreddits.filter((subreddit) => value.includes(subreddit.id));

  const displayValue =
    selectedSubreddits.length > 0
      ? selectedSubreddits.map((s) => `r/${s.name}`).join(", ")
      : "Select subreddit...";

  const selectSubreddit = (currentValue: string) => {
    if (multiple) {
      onChange(
        value.includes(currentValue)
          ? value.filter((v) => v !== currentValue)
          : [...value, currentValue]
      );
      return;
    }

    onChange([currentValue]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {isLoading ? "Loading..." : displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search subreddits..." />
          <CommandEmpty>No subreddit found.</CommandEmpty>
          <CommandGroup>
            {subreddits.map((subreddit) => (
              <CommandItem
                key={subreddit.id}
                value={subreddit.name}
                onSelect={() => selectSubreddit(subreddit.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-1">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(subreddit.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  r/{subreddit.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatViewCount(subreddit.memberCount)}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
