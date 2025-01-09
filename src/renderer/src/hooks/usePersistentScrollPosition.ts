import { useEffect, useRef } from "react";

export const usePersistentScrollPosition = <T extends HTMLElement>(
  dependencies: unknown[] = []
) => {
  const elementRef = useRef<T>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const saveScrollPosition = () => {
      scrollPositionRef.current = element.scrollTop;
    };

    element.addEventListener("scroll", saveScrollPosition);
    return () => element.removeEventListener("scroll", saveScrollPosition);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.scrollTop = scrollPositionRef.current;
  }, dependencies);

  return elementRef;
};
