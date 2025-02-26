import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  alwaysOpen?: boolean;
  className?: string;
};

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  alwaysOpen = false,
  className,
}: SearchInputProps) => {
  const [isOpen, setIsOpen] = useState(Boolean(value) || alwaysOpen);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const open = alwaysOpen || isOpen;

  // Sync external value changes and expand if value is set
  useEffect(() => {
    setLocalValue(value);
    if (value) {
      setIsOpen(true);
    }
  }, [value]);

  // Debounced onChange handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange, debounceMs]);

  const handleBlur = () => {
    if (!localValue) {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "flex items-center border rounded-md border-border transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            // Only focus when opening
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        className={cn("flex h-9 w-9 shrink-0 items-center justify-center cursor-pointer")}
        aria-label={isOpen ? "Close search" : "Open search"}
      >
        <Search className="h-4 w-4" />
      </button>
      <div
        className={cn(
          "relative transition-all duration-200 overflow-hidden",
          open ? "auto" : "w-0"
        )}
      >
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className="pl-2 pr-8 border-none rounded-none"
          />
          {localValue && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="text-muted-foreground" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
