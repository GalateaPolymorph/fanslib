import { createContext, useContext, useState, type FC, type ReactNode } from "react";
import { Media } from "../../../features/library/entity";

type MediaDragContextType = {
  isDragging: boolean;
  draggedMedias: Media[];
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, medias: Media[]) => void;
  handleDragEnd: () => void;
};

const MediaDragContext = createContext<MediaDragContextType | undefined>(undefined);

type MediaDragProviderProps = {
  children: ReactNode;
};

export const MediaDragProvider: FC<MediaDragProviderProps> = ({ children }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedMedias, setDraggedMedias] = useState<Media[]>([]);

  const handleDragStart = (_: React.DragEvent<HTMLDivElement>, medias: Media[]) => {
    setIsDragging(true);
    setDraggedMedias(medias);
  };

  const handleDragEnd = () => {
    console.log("drag end");
    setIsDragging(false);
    setDraggedMedias([]);
  };

  return (
    <MediaDragContext.Provider
      value={{ isDragging, draggedMedias, handleDragStart, handleDragEnd }}
    >
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
