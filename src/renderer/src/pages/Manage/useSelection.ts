import { useEffect, useState } from "react";
import { Media } from "../../../../features/library/entity";

type UseSelectionProps = {
  media: Media[];
};

type UseSelectionReturn = {
  selectedMediaIds: Set<string>;
  selectedCategories: string[];
  isSelected: (mediaId: string) => boolean;
  toggleMediaSelection: (mediaId: string, event: React.MouseEvent) => void;
  clearSelection: () => void;
  lastClickedIndex: number | null;
  isShiftPressed: boolean;
};

export const useSelection = ({ media }: UseSelectionProps): UseSelectionReturn => {
  const [selectedMediaIds, setSelectedMediaIds] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    // Handle case where user switches windows while holding shift
    const handleBlur = () => {
      setIsShiftPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [lastClickedIndex]);

  useEffect(() => {
    // When media items are filtered out (e.g. by category), remove them from selection
    // If all selected items are filtered out, clear the entire selection state
    const mediaIds = new Set(media.map((m) => m.id));
    const newSelectedIds = new Set(Array.from(selectedMediaIds).filter((id) => mediaIds.has(id)));

    if (newSelectedIds.size !== selectedMediaIds.size) {
      setSelectedMediaIds(newSelectedIds);
      if (newSelectedIds.size === 0) {
        setSelectedCategories([]);
        setLastClickedIndex(null);
      }
    }
  }, [media]);

  const getIndexRange = (index1: number, index2: number) => {
    const start = Math.min(index1, index2);
    const end = Math.max(index1, index2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const toggleMediaSelection = (mediaId: string, event: React.MouseEvent) => {
    event.preventDefault();
    const currentIndex = media.findIndex((m) => m.id === mediaId);

    // Multi-selection (shift + click)
    if (isShiftPressed && lastClickedIndex !== null) {
      const indices = getIndexRange(lastClickedIndex, currentIndex);
      setSelectedMediaIds((prev) => {
        const newSelection = new Set(prev);
        indices.forEach((i) => {
          if (i >= 0 && i < media.length) {
            newSelection.add(media[i].id);
          }
        });
        return newSelection;
      });
      setLastClickedIndex(currentIndex);
      return;
    }

    // Single selection
    setSelectedMediaIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(mediaId)) {
        newSelection.delete(mediaId);
      } else {
        newSelection.add(mediaId);
      }
      return newSelection;
    });
    setLastClickedIndex(currentIndex);
  };

  const isSelected = (mediaId: string) => {
    return selectedMediaIds.has(mediaId);
  };

  const clearSelection = () => {
    setSelectedMediaIds(new Set());
    setSelectedCategories([]);
    setLastClickedIndex(null);
  };

  return {
    selectedMediaIds,
    selectedCategories,
    isSelected,
    toggleMediaSelection,
    clearSelection,
    lastClickedIndex,
    isShiftPressed,
  };
};
