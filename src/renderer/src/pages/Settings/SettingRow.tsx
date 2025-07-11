import { cn } from "@renderer/lib/utils";
import { ReactNode } from "react";

type SettingRowProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  descriptionSlot?: ReactNode;
  className?: string;
  variant?: "default" | "secondary";
  spacing?: "default" | "compact";
};

export const SettingRow = ({
  title,
  description,
  children,
  descriptionSlot,
  className,
  variant = "default",
  spacing = "default",
}: SettingRowProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4 md:gap-8",
        spacing === "default" && "py-4",
        spacing === "compact" && "py-1",
        variant === "secondary" && "pl-6",
        className
      )}
    >
      <div className="space-y-1">
        <h3
          className={cn("font-medium", {
            "text-lg": variant === "default",
            "text-sm": variant === "secondary",
          })}
        >
          {title ?? <span className="text-muted-foreground">{title}</span>}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-tight">{description}</p>
        )}
        {descriptionSlot}
      </div>
      <div className={cn("flex items-center pt-0.5", variant === "secondary" && "pt-0")}>
        {children}
      </div>
    </div>
  );
};
