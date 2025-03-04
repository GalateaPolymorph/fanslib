import { formatViewCount } from "@renderer/lib/format-views";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Subreddit } from "../../../features/channels/subreddit";
import type { SubredditPostFilter as SubredditPostFilterType } from "../../../features/library/api-type";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

type SubredditPostFilterProps = {
  value: SubredditPostFilterType[];
  onChange: (filters: SubredditPostFilterType[]) => void;
};

export const SubredditPostFilter = ({ value, onChange }: SubredditPostFilterProps) => {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [displayedSubredditIds, setDisplayedSubredditIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const loadSubreddits = async () => {
      try {
        setIsLoading(true);
        const fetchedSubreddits = await window.api["channel:subreddit-list"]();
        setSubreddits(fetchedSubreddits);

        // Initialize displayed subreddits from existing filters
        const existingSubredditIds = value.map((f) => f.subredditId);
        setDisplayedSubredditIds(existingSubredditIds);
      } catch (error) {
        console.error("Failed to load subreddits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubreddits();
  }, [value]);

  const toggleFilter = (subredditId: string, toggleValue: string | null) => {
    const target = toggleValue === "true" ? true : toggleValue === "false" ? false : undefined;

    onChange([
      ...value.filter((f) => f.subredditId !== subredditId),
      ...(target === undefined ? [] : [{ subredditId, posted: target }]),
    ]);
  };

  const removeSubreddit = (subredditId: string) => {
    setDisplayedSubredditIds((prev) => prev.filter((id) => id !== subredditId));
    onChange(value.filter((f) => f.subredditId !== subredditId));
  };

  const addSubreddit = (subredditId: string) => {
    if (!displayedSubredditIds.includes(subredditId)) {
      setDisplayedSubredditIds((prev) => [...prev, subredditId]);
    }
    setSearchOpen(false);
  };

  const selectedFiltersFormatted = value.slice(0, 2).map((f) => {
    const subreddit = subreddits.find((s) => s.id === f.subredditId);
    return (
      <div className="flex text-2xs items-center" key={f.subredditId}>
        {f.posted ? "Posted " : "Not posted "} in{" "}
        <strong className="ml-1">r/{subreddit?.name}</strong>
      </div>
    );
  });

  const displayedSubreddits = subreddits.filter((s) => displayedSubredditIds.includes(s.id));
  const availableSubreddits = subreddits.filter((s) => !displayedSubredditIds.includes(s.id));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px]">
          {selectedFiltersFormatted.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">{selectedFiltersFormatted}</div>
              {value.length > 2 && (
                <div className="text-2xs text-muted-foreground">+{value.length - 2} more</div>
              )}
            </div>
          ) : (
            "Subreddit"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-4">
        <div className="space-y-4">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Find a subreddit...
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0">
              <Command>
                <CommandInput placeholder="Search subreddits..." />
                <CommandEmpty>No subreddit found.</CommandEmpty>
                <CommandGroup>
                  {availableSubreddits.map((subreddit) => (
                    <CommandItem
                      key={subreddit.id}
                      value={subreddit.name}
                      onSelect={() => addSubreddit(subreddit.id)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1">r/{subreddit.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatViewCount(subreddit.memberCount)}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="text-sm font-medium text-muted-foreground">Posted in...</div>
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading subreddits...</div>
            ) : displayedSubreddits.length === 0 ? (
              <div className="text-sm text-muted-foreground">No subreddits selected</div>
            ) : (
              displayedSubreddits.map((subreddit) => {
                const currentFilter = value.find((f) => f.subredditId === subreddit.id);
                return (
                  <div key={subreddit.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="text-sm font-medium truncate">r/{subreddit.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0"
                        onClick={() => removeSubreddit(subreddit.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <ToggleGroup
                      type="single"
                      value={currentFilter ? (currentFilter.posted ? "true" : "false") : null}
                      onValueChange={(newValue) => toggleFilter(subreddit.id, newValue)}
                      className="flex-1"
                    >
                      <ToggleGroupItem
                        value="true"
                        className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        aria-label="Posted"
                      >
                        <Check className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="false"
                        className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        aria-label="Not posted"
                      >
                        <X className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
