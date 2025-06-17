import { STORAGE_KEYS, useLocalStorageState } from "@renderer/lib/local-storage";
import { useEffect, useRef, useState } from "react";

export const useScrollPosition = <T extends HTMLElement>(
  setCondition: boolean
): React.RefObject<T> => {
  const elementRef = useRef<T>(null);
  const [element, setElement] = useState<T | null>(null);
  const [scrollYStorage, setScrollYStorage] = useLocalStorageState(
    STORAGE_KEYS.CALENDAR_SCROLL_POSITION,
    0
  );

  // Track when element becomes available
  useEffect(() => {
    if (elementRef.current !== element) {
      setElement(elementRef.current);
    }
  });

  useEffect(() => {
    if (setCondition && element) {
      element.scrollTop = scrollYStorage;
    }
  }, [setCondition, scrollYStorage, element]);

  useEffect(() => {
    if (!element) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollYStorage(element.scrollTop);
      }, 150);
    };

    element.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(scrollTimeout);
      element.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element]);

  return elementRef;
};
