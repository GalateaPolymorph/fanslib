import { MediaTagEditor } from "@renderer/components/MediaTagEditor";
import { Tag } from "lucide-react";
import { useState } from "react";
import { Media } from "../../../../../../features/library/entity";
import { Button } from "../../../../components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/Popover";

type TagAssignerProps = {
  selectedMedia: Media[];
  disabled?: boolean;
};

export const TagAssigner = ({ selectedMedia, disabled = false }: TagAssignerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          disabled={disabled || selectedMedia.length === 0}
        >
          <Tag className="h-4 w-4" />
          Add Tag
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4" align="start">
        <MediaTagEditor media={selectedMedia} className="max-h-[400px] overflow-y-auto" />
      </PopoverContent>
    </Popover>
  );
};
