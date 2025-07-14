import { MediaSelection } from "@renderer/components/MediaSelection";
import { Button } from "@renderer/components/ui/Button";
import { FormDialog } from "@renderer/components/ui/FormDialog/FormDialog";
import { FormActions } from "@renderer/components/ui/FormActions/FormActions";
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
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Select Media"
      description="Choose media to attach to your post"
      maxWidth="2xl"
      contentClassName="h-[80vh]"
      footer={
        <FormActions>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selectedMedia.length === 0}>
            Select Media
          </Button>
        </FormActions>
      }
    >
      <div className="flex-1 min-h-0">
        <MediaSelection
          selectedMedia={selectedMedia}
          onMediaSelect={handleMediaSelect}
          excludeMediaIds={currentMedia ? [currentMedia.id] : []}
          className="h-full"
        />
      </div>
    </FormDialog>
  );
};
