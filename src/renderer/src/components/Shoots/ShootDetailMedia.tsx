import { MediaTile } from "@renderer/components/MediaTile";
import { Button } from "@renderer/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { useToast } from "@renderer/components/ui/use-toast";
import { cn } from "@renderer/lib/utils";
import { Trash2Icon } from "lucide-react";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { ShootWithMedia } from "../../../../features/shoots/api-type";

type ShootDetailMediaProps = {
  shoot: ShootWithMedia;
  media: ShootWithMedia["media"][number];
  onUpdate: () => void;
  isActivePreview: boolean;
};

export const ShootDetailMedia: FC<ShootDetailMediaProps> = ({
  shoot,
  media,
  onUpdate,
  isActivePreview,
}) => {
  const { toast } = useToast();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const removeMediaFromShoot = async () => {
    try {
      const updatedMediaIds = shoot.media?.filter((m) => m.id !== media.id).map((m) => m.id) || [];

      await window.api["shoot:update"](shoot.id, {
        mediaIds: updatedMediaIds,
      });

      onUpdate();
      toast({
        title: "Media removed from shoot",
      });
    } catch (error) {
      console.error("Failed to remove media from shoot:", error);
      toast({
        title: "Failed to remove media from shoot",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="group relative aspect-square cursor-pointer rounded-lg overflow-hidden">
            <Link
              to={`/content/${media.id}`}
              className="block w-full h-full hover:opacity-90 transition-opacity"
            >
              <div className="absolute inset-0 z-10 border-2 border-transparent rounded-lg">
                <MediaTile
                  media={media}
                  className="w-full h-full"
                  isActivePreview={isActivePreview}
                />
              </div>
            </Link>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="flex gap-1 p-0.5 bg-background border border-border">
          <Button
            variant="ghost"
            size={confirmingDelete ? "default" : "icon"}
            className={cn(
              "h-7 text-muted-foreground hover:text-destructive transition-all duration-100",
              confirmingDelete ? "w-[72px] px-2" : "w-7"
            )}
            onClick={(e) => {
              e.stopPropagation();
              if (confirmingDelete) {
                removeMediaFromShoot();
                setConfirmingDelete(false);
              } else {
                setConfirmingDelete(true);
              }
            }}
            onMouseLeave={() => setConfirmingDelete(false)}
          >
            <div className="flex items-center gap-1.5">
              <Trash2Icon size={14} />
              {confirmingDelete && <span className="text-xs">Sure?</span>}
            </div>
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
