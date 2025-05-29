import { Search, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

type SearchFilterContentProps = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export const SearchFilterContent = ({ value, onChange }: SearchFilterContentProps) => (
  <div className="flex items-center gap-2 w-full">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        className="pl-9 pr-8"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search media paths..."
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange(undefined)}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  </div>
);
