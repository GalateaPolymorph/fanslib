import { cn } from "@renderer/lib/utils";
import { FolderOpen } from "lucide-react";
import { useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
  onTextChange?: (value: string) => void;
  className?: string;
  buttonVariant?: "default" | "outline" | "ghost";
  placeholder?: string;
  directory?: boolean;
}

export const FileInput = ({
  value = "",
  onChange,
  onTextChange,
  className,
  buttonVariant = "outline",
  placeholder = "Select a file...",
  directory = false,
  ...props
}: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onChange) {
      // For directory selection, we want the directory path
      if (directory) {
        // In Electron, file.path gives us the full path
        onChange(files[0].path.split("/").slice(0, -1).join("/"));
      } else {
        onChange(files[0].path);
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onTextChange) {
      onTextChange(e.target.value);
    }
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <div className="flex-1">
        <Input
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        {...(directory ? { webkitdirectory: "", directory: "" } : {})}
        {...props}
      />
      <Button
        variant={buttonVariant}
        size="icon"
        onClick={handleBrowseClick}
        title={directory ? "Browse for folder" : "Browse for file"}
        type="button"
      >
        <FolderOpen className="h-4 w-4" />
      </Button>
    </div>
  );
};
