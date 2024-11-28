import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "./ui/sheet";
import { Button } from "./ui/button";

interface MediaSidebarProps {
  media: any;
  visible: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export const MediaSidebar: React.FC<MediaSidebarProps> = ({ media, visible, onClose, isMobile }) => {
  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent side={isMobile ? "bottom" : "right"} className={isMobile ? "w-full h-full" : "w-96"}>
        <SheetHeader>
          <SheetTitle>{media.name}</SheetTitle>
          <SheetDescription>{media.type}</SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <p><strong>Size:</strong> {media.size}</p>
          <p><strong>Path:</strong> {media.path}</p>
          <p><strong>Created:</strong> {media.created}</p>
          <p><strong>Modified:</strong> {media.modified}</p>
        </div>
        <SheetClose asChild>
          <Button variant="outline" onClick={onClose}>Back</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
};
