import { Search } from "lucide-react";
import { Input } from "../ui/input";

type TagSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const TagSearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
}: TagSearchInputProps) => {
  return (
    <div className="relative p-2 border-b">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};
