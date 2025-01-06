import { cn } from "@renderer/lib/utils";
import { ImageIcon, VideoIcon } from "lucide-react";
import { type FC, useState } from "react";
import { ShootWithMedia } from "../../../../../features/shoots/api-type";
import { MediaTileLite } from "../../../components/MediaTileLite";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { useLibraryPreferences } from "../../../contexts/LibraryPreferencesContext";
import { useMediaDrag } from "../../../contexts/MediaDragContext";
import { ShootDetailDate } from "./ShootDetailDate";
import { ShootDetailDeleteButton } from "./ShootDetailDeleteButton";
import { ShootDetailDropZone } from "./ShootDetailDropZone";
import { ShootDetailEditButton } from "./ShootDetailEditButton";
import { ShootDetailTitle } from "./ShootDetailTitle";

type ShootDetailProps = {
  shoot: ShootWithMedia;
  onUpdate?: () => void;
  isFirst?: boolean;
};

export const ShootDetail: FC<ShootDetailProps> = ({ shoot, onUpdate, isFirst = false }) => {
  const { preferences } = useLibraryPreferences();
  const { isDragging } = useMediaDrag();
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    setIsEditing(false);
    onUpdate?.();
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card className="group w-full">
      <CardHeader className="flex flex-row justify-between w-full">
        <div className="flex flex-col gap-2">
          <CardTitle>
            <ShootDetailTitle
              shoot={shoot}
              isEditing={isEditing}
              onUpdate={handleUpdate}
              onCancel={handleCancel}
            />
          </CardTitle>
          <div>
            <div className="flex items-center group gap-4 text-sm text-muted-foreground">
              <ShootDetailDate shoot={shoot} isEditing={isEditing} onUpdate={onUpdate} />
              <div className="flex gap-1 text-sm text-muted-foreground items-center">
                <div className="flex items-center gap-1">
                  <span>{shoot.media?.filter((m) => m.type === "image").length ?? 0}</span>
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span>{shoot.media?.filter((m) => m.type === "video").length ?? 0}</span>
                  <VideoIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <ShootDetailEditButton
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onCancel={handleCancel}
          />
          <ShootDetailDeleteButton shoot={shoot} onUpdate={onUpdate} />
        </div>
      </CardHeader>
      <CardContent>
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
              <div key={media.id} className="aspect-square">
                <MediaTileLite media={media} className="w-full h-full" />
              </div>
            ))}
            {isDragging && <ShootDetailDropZone shoot={shoot} onUpdate={onUpdate} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
