import { Button } from "@renderer/components/ui/button";
import { useShootAccordionState } from "@renderer/hooks";
import { cn } from "@renderer/lib/utils";
import { useState, type FC } from "react";
import { Media } from "../../../../features/library/entity";
import { ShootWithMedia, UpdateShootPayload } from "../../../../features/shoots/api-type";
import { useLibraryPreferences } from "../../contexts/LibraryPreferencesContext";
import { useMediaDrag } from "../../contexts/MediaDragContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ShootDetailDeleteButton } from "./ShootDetailDeleteButton";
import { ShootDetailDropZone } from "./ShootDetailDropZone";
import { ShootDetailEditButton } from "./ShootDetailEditButton";
import { ShootDetailMedia } from "./ShootDetailMedia";
import { ShootHeader } from "./ShootHeader";

type ShootDetailProps = {
  shoot: ShootWithMedia;
  groupedMedia: Map<string, Media[]>;
  onUpdate: () => void;
};

type ShootDetailContentProps = {
  shoot: ShootWithMedia;
  groupedMedia: Map<string, Media[]>;
  onUpdate: () => void;
};

const ShootDetailContent = ({ shoot, groupedMedia, onUpdate }: ShootDetailContentProps) => {
  const { preferences: libraryPreferences, updatePreferences } = useLibraryPreferences();
  const { isDragging } = useMediaDrag();
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, setIsOpen } = useShootAccordionState(shoot.id);

  const handleUpdate = async (payload: UpdateShootPayload) => {
    try {
      await window.api["shoot:update"](shoot.id, payload);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Failed to update shoot:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderMediaGrid = (mediaList: Media[], allMedias: Media[]) => {
    const mediaIndex = (media: Media) => allMedias.findIndex((m) => m.id === media.id);

    return (
      <div
        className={cn(
          "grid gap-2",
          libraryPreferences.view.gridSize === "large"
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            : "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
        )}
      >
        {mediaList.map((media) => (
          <ShootDetailMedia
            key={media.id}
            shootId={shoot.id}
            media={media}
            index={mediaIndex(media)}
            allMedias={shoot.media}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    );
  };

  return (
    <Accordion
      type="single"
      value={isOpen ? "item-1" : ""}
      onValueChange={(value) => setIsOpen(!!value)}
      className="w-full"
    >
      <AccordionItem value="item-1" className="border rounded-md">
        <AccordionTrigger
          className={cn(
            "hover:no-underline cursor-pointer hover:bg-muted/50 px-4 py-2",
            !isOpen && "hover:bg-muted/50"
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing) return;
            setIsOpen(!isOpen);
          }}
        >
          <ShootHeader
            shoot={shoot}
            isEditing={isEditing}
            onUpdate={handleUpdate}
            onCancel={handleCancel}
          />
        </AccordionTrigger>
        <AccordionContent className="px-4 flex-col flex">
          <div className="flex flex-col gap-4 pb-4" onClick={(e) => e.stopPropagation()}>
            {shoot.media && (
              <div className="flex flex-col gap-6">
                {renderMediaGrid(Array.from(groupedMedia.values()).flat(), shoot.media)}
                {isDragging && <ShootDetailDropZone shoot={shoot} onUpdate={onUpdate} />}
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-between py-2">
            <Button
              variant="outline"
              onClick={() =>
                updatePreferences({
                  filter: [{ include: true, items: [{ type: "shoot", id: shoot.id }] }],
                })
              }
            >
              View in Library
            </Button>
            <div className="flex gap-2">
              <ShootDetailEditButton
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onCancel={handleCancel}
              />
              <ShootDetailDeleteButton shoot={shoot} onUpdate={onUpdate} />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export const ShootDetail: FC<ShootDetailProps> = ({ shoot, groupedMedia, onUpdate }) => {
  return <ShootDetailContent shoot={shoot} groupedMedia={groupedMedia} onUpdate={onUpdate} />;
};
