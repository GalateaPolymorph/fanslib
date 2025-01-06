import { createContext, useContext, useState, type FC, type ReactNode } from "react";
import { Media } from "../../../features/library/entity";

type MediaDragContextType = {
  isDragging: boolean;
  draggedMedia: Media | null;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, media: Media) => void;
  handleDragEnd: () => void;
};

const MediaDragContext = createContext<MediaDragContextType | undefined>(undefined);

type MediaDragProviderProps = {
  children: ReactNode;
};

export const MediaDragProvider: FC<MediaDragProviderProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedMedia, setDraggedMedia] = useState<Media | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, media: Media) => {
    console.log("drag start");
    setIsDragging(true);
    setDraggedMedia(media);
  };

  const handleDragEnd = () => {
    console.log("drag end");
    setIsDragging(false);
    setDraggedMedia(null);
  };

  return (
    <MediaDragContext.Provider value={{ isDragging, draggedMedia, handleDragStart, handleDragEnd }}>
      {children}
    </MediaDragContext.Provider>
  );
};

export const useMediaDrag = (): MediaDragContextType => {
  const context = useContext(MediaDragContext);
  if (!context) {
    throw new Error("useMediaDrag must be used within a MediaDragProvider");
  }
  return context;
};
