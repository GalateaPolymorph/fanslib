import { useCallback, useState } from "react";

const STORAGE_KEY = "shoot:accordion:state";

export const useShootAccordionState = (shootId: string) => {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const openShoots = new Set(JSON.parse(stored));
        return openShoots.has(shootId);
      }
    } catch (error) {
      console.error("Failed to parse shoot accordion state:", error);
    }
    return false;
  });

  const updateOpenState = useCallback(
    (open: boolean) => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const openShoots = new Set(stored ? JSON.parse(stored) : []);

        if (open) {
          openShoots.add(shootId);
        } else {
          openShoots.delete(shootId);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(openShoots)));
        setIsOpen(open);
      } catch (error) {
        console.error("Failed to update shoot accordion state:", error);
        setIsOpen(open);
      }
    },
    [shootId]
  );

  return {
    isOpen,
    setIsOpen: updateOpenState,
  };
};
