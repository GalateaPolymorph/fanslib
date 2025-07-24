import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useTagDimensions } from "../../hooks/api/tags/useTagDimensions";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/Command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";

type DimensionFilterSelectorProps = {
  value?: number;
  onChange: (dimensionId: number) => void;
};

export const DimensionFilterSelector = ({ value, onChange }: DimensionFilterSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { data: dimensions = [], isLoading } = useTagDimensions();

  const selectedDimension = dimensions.find((d) => d.id === value);

  const handleSelectDimension = (dimensionId: number) => {
    onChange(dimensionId);
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
          {isLoading
            ? "Loading..."
            : selectedDimension
              ? `No ${selectedDimension.name} tags`
              : "Select dimension..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search dimensions..." />
          <CommandEmpty>No dimension found.</CommandEmpty>
          <CommandGroup>
            {dimensions.map((dimension) => (
              <CommandItem
                key={dimension.id}
                value={dimension.name}
                onSelect={() => handleSelectDimension(dimension.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === dimension.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {dimension.name} tags
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
