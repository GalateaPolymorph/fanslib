import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { cn, formatFileSize } from "@renderer/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { MediaFile } from "../../../features/library/shared/types";
import { Media } from "./Media";

interface MediaDetailProps {
  media: MediaFile;
  onClose: () => void;
  className?: string;
}

const revealInFinder = (mediaPath: string) => {
  window.api.os.revealInFinder(mediaPath);
};

export const MediaDetail = ({ media, onClose, className }: MediaDetailProps) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.3,
        ease: "easeInOut",
      }}
      className={cn("flex flex-col bg-background h-full w-full", className)}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">{media.name}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 @container p-4">
        <div className="grid grid-cols-1 @[800px]:grid-cols-2 gap-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <Media file={media} />
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {media.name}
            </p>
            <p>
              <span className="font-medium">Size:</span> {formatFileSize(media.size)}
            </p>
            <p className="break-all">
              <span className="font-medium">Path:</span> {media.path}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => revealInFinder(media.path)}
              className="cursor-pointer"
            >
              Reveal in Finder
            </Button>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};
