import { cn } from "@renderer/lib/utils";
import { ImageIcon, VideoIcon } from "lucide-react";
import { type FC, useState } from "react";
import { ShootWithMedia } from "../../../../features/shoots/api-type";
import { useLibraryPreferences } from "../../contexts/LibraryPreferencesContext";
import { useMediaDrag } from "../../contexts/MediaDragContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Button } from "../ui/button";
import { ShootDetailDate } from "./ShootDetailDate";
import { ShootDetailDeleteButton } from "./ShootDetailDeleteButton";
import { ShootDetailDropZone } from "./ShootDetailDropZone";
import { ShootDetailEditButton } from "./ShootDetailEditButton";
import { ShootDetailMedia } from "./ShootDetailMedia";
import { ShootDetailTitle } from "./ShootDetailTitle";

type ShootDetailProps = {
  shoot: ShootWithMedia;
  onUpdate?: () => void;
};

export const ShootDetail: FC<ShootDetailProps> = ({ shoot, onUpdate = () => {} }) => {
  const { preferences, updateFilterPreferences } = useLibraryPreferences();
  const { isDragging } = useMediaDrag();
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMediaId, setHoveredMediaId] = useState<string | null>(null);

  const handleUpdate = () => {
    setIsEditing(false);
    onUpdate();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleMouseEnter = (mediaId: string) => {
    setHoveredMediaId(mediaId);
  };

  const handleMouseLeave = () => {
    setHoveredMediaId(null);
  };

  const ShootHeader = () => {
    const imageCount = shoot.media?.filter((m) => m.type === "image").length ?? 0;
    const videoCount = shoot.media?.filter((m) => m.type === "video").length ?? 0;

    return (
      <div className="flex flex-row justify-between w-full py-4">
        <div className="flex flex-col gap-2">
          <div className="text-left">
            <ShootDetailTitle
              shoot={shoot}
              isEditing={isEditing}
              onUpdate={handleUpdate}
              onCancel={handleCancel}
            />
          </div>
          <div>
            <div className="flex items-center group gap-4 text-sm text-muted-foreground">
              <ShootDetailDate shoot={shoot} isEditing={isEditing} onUpdate={onUpdate} />
              <div className="flex gap-1 text-sm text-muted-foreground items-center">
                {imageCount > 0 && (
                  <div className="flex items-center gap-1">
                    <span>{imageCount}</span>
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
                {videoCount > 0 && (
                  <div className="flex items-center gap-1">
                    <span>{videoCount}</span>
                    <VideoIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
          <ShootHeader />
        </AccordionTrigger>
        <AccordionContent className="px-4 flex-col flex">
          <div className="flex flex-col gap-4 pb-4" onClick={(e) => e.stopPropagation()}>
            {shoot.media && (
              <div
                className={cn(
                  "grid gap-2",
                  preferences.view.gridSize === "large"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                    : "grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
                )}
              >
                {shoot.media.map((media) => (
                  <div
                    key={media.id}
                    className="aspect-square"
                    onMouseEnter={() => handleMouseEnter(media.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <ShootDetailMedia
                      shoot={shoot}
                      media={media}
                      onUpdate={onUpdate}
                      isActivePreview={hoveredMediaId === media.id}
                    />
                  </div>
                ))}
                {isDragging && <ShootDetailDropZone shoot={shoot} onUpdate={onUpdate} />}
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-between py-2">
            <div>
              <Button
                variant="outline"
                onClick={() => updateFilterPreferences({ shootId: shoot.id })}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Show in library
              </Button>
            </div>
            <div className="flex gap-2 self-end">
              <ShootDetailEditButton
                isEditing={isEditing}
                onEdit={() => {
                  setIsEditing(true);
                }}
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
