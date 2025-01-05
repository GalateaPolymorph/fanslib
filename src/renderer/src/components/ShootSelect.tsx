import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { ShootSummary } from "../../../features/shoots/api-type";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type ShootSelectProps = {
  value?: string[];
  onChange: (shootIds: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
};

export const ShootSelect = ({
  value = [],
  onChange,
  multiple = true,
  disabled = false,
}: ShootSelectProps) => {
  const [open, setOpen] = useState(false);
  const [shoots, setShoots] = useState<ShootSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadShoots = async () => {
      try {
        const response = await window.api["shoot:getAll"]();
        setShoots(response.items);
      } catch (error) {
        console.error("Failed to load shoots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShoots();
  }, []);

  const handleToggleShoot = (shootId: string) => {
    if (disabled) return;

    if (value.includes(shootId)) {
      onChange(value.filter((id) => id !== shootId));
    } else {
      if (multiple) {
        onChange([...value, shootId]);
      } else {
        onChange([shootId]);
      }
    }
  };

  const filteredShoots = shoots.filter((shoot) =>
    shoot.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedShoots = shoots.filter((shoot) => value.includes(shoot.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[250px] justify-between"
          disabled={disabled || isLoading}
        >
          {selectedShoots.length > 0 ? (
            <div className="flex gap-1 flex-wrap">
              {selectedShoots.map((shoot) => (
                <Badge
                  variant="secondary"
                  key={shoot.id}
                  className="mr-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleShoot(shoot.id);
                  }}
                >
                  {shoot.name}
                </Badge>
              ))}
            </div>
          ) : (
            "Exclude shoots..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search shoots..." value={search} onValueChange={setSearch} />
          {isLoading ? (
            <CommandEmpty>Loading shoots...</CommandEmpty>
          ) : filteredShoots.length === 0 ? (
            <CommandEmpty>No shoots found.</CommandEmpty>
          ) : (
            filteredShoots.map((shoot) => (
              <CommandItem
                key={shoot.id}
                onSelect={() => {
                  handleToggleShoot(shoot.id);
                  if (!multiple) {
                    setOpen(false);
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(shoot.id) ? "opacity-100" : "opacity-0"
                  )}
                />
                {shoot.name}
              </CommandItem>
            ))
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
