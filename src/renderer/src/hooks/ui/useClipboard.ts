import { useCallback, useState } from "react";

type UseClipboardReturn = {
  copyToClipboard: (text: string) => void;
  isCopied: boolean;
  isError: boolean;
};

export const useClipboard = (resetDelay = 2000): UseClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);
  const [isError, setIsError] = useState(false);

  const copyToClipboard = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      try {
        window.api["os:copyToClipboard"](text);
        setIsCopied(true);
        setIsError(false);
        setTimeout(() => setIsCopied(false), resetDelay);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        setIsError(true);
        setIsCopied(false);
        setTimeout(() => setIsError(false), resetDelay);
      }
    },
    [resetDelay]
  );

  return {
    copyToClipboard,
    isCopied,
    isError,
  };
};
