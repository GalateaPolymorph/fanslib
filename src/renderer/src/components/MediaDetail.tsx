import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { MediaFile } from "../../../features/library/shared/types";
import { cn, formatFileSize } from "../lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface MediaDetailProps {
  media: MediaFile;
  onClose: () => void;
  className?: string;
}

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
      className={cn("flex flex-col bg-background h-full", className)}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Media Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {media.type === "image" ? (
              <img src={media.path} alt={media.name} className="w-full h-full object-cover" />
            ) : (
              <video src={media.path} controls className="w-full h-full object-cover" />
            )}
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span> {media.name}
            </p>
            <p>
              <span className="font-medium">Size:</span> {formatFileSize(media.size)}
            </p>
            <p>
              <span className="font-medium">Type:</span> {media.type}
            </p>
            <p className="break-all">
              <span className="font-medium">Path:</span> {media.path}
            </p>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};
