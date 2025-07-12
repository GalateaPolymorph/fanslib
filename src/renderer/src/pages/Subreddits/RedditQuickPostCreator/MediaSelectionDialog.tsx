import { MediaSelection } from "@renderer/components/MediaSelection";
import { Button } from "@renderer/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@renderer/components/ui/Dialog";
import { useState } from "react";
import { Media } from "../../../../../features/library/entity";

type MediaSelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMediaSelect: (media: Media) => void;
  currentMedia?: Media | null;
};

export const MediaSelectionDialog = ({
  open,
  onOpenChange,
  onMediaSelect,
  currentMedia,
}: MediaSelectionDialogProps) => {
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);

  const handleMediaSelect = (media: Media) => {
    setSelectedMedia([media]);
  };

  const handleConfirm = () => {
    if (selectedMedia.length > 0) {
      onMediaSelect(selectedMedia[0]);
      onOpenChange(false);
      setSelectedMedia([]);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setSelectedMedia([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <MediaSelection
            selectedMedia={selectedMedia}
            onMediaSelect={handleMediaSelect}
            excludeMediaIds={currentMedia ? [currentMedia.id] : []}
            className="h-full"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selectedMedia.length === 0}>
            Select Media
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
