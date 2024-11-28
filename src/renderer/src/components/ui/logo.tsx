import { cn } from "@renderer/lib/utils";
import React from "react";

interface LogoProps {
  isOpen?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ isOpen = true }) => {
  return (
    <div
      className={cn(
        "flex items-center font-bold text-2xl cursor-default pointer-events-none select-none",
        isOpen ? "text-2xl" : "text-lg gap-0"
      )}
    >
      {isOpen ? (
        <>
          <span className="text-foreground">Fans</span>
          <span className="text-background bg-primary/70 rounded px-1">Lib</span>
        </>
      ) : (
        <>
          <span className="text-foreground">F</span>
          <span className="text-background bg-primary/70 rounded px-1">L</span>
        </>
      )}
    </div>
  );
};
