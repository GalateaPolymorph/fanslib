import { Button } from "@renderer/components/ui/button";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { cn, formatFileSize } from "@renderer/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Media } from "../../../../lib/database/media/type";
import { CategorySelect } from "../../components/CategorySelect";
import { MediaDisplay } from "../../components/MediaDisplay";

interface MediaDetailProps {
  media: Media;
  onClose: () => void;
  className?: string;
}

const revealInFinder = (mediaPath: string) => {
  window.api.os.revealInFinder(mediaPath);
};

export const MediaDetail = ({ media, onClose, className }: MediaDetailProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    media.categories?.map((c) => c.slug) || []
  );

  useEffect(() => {
    setSelectedCategories(media.categories?.map((c) => c.slug) || []);
  }, [media]);

  const handleCategoryChange = async (categorySlugs: string[]) => {
    setSelectedCategories(categorySlugs);
    return window.api.library.updateMedia(media.path, {
      categoryIds: categorySlugs,
    });
  };

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
      <ScrollArea className="flex-1 @container p-4 ">
        <div className="grid grid-cols-1 @[800px]:grid-cols-2 gap-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <MediaDisplay media={media} />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <CategorySelect value={selectedCategories} onChange={handleCategoryChange} />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => revealInFinder(media.path)}
                className="cursor-pointer"
              >
                Reveal in Finder
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">File Information</h3>
              <div className="space-y-2 text-sm divide-y">
                <div className="flex items-center py-1.5 ">
                  <span className="font-medium w-16">Name</span>
                  <span className="text-muted-foreground">{media.name}</span>
                </div>
                <div className="flex items-center py-1.5 ">
                  <span className="font-medium w-16">Size</span>
                  <span className="text-muted-foreground">{formatFileSize(media.size)}</span>
                </div>
                <div className="flex py-1.5 ">
                  <span className="font-medium w-16 shrink-0">Path</span>
                  <span className="text-muted-foreground break-all">{media.path}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  );
};
