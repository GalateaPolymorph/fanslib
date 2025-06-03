import { Badge } from "@renderer/components/ui/badge";
import { SelectionState } from "@renderer/lib/selection-state";
import { cn } from "@renderer/lib/utils";
import { Check, Circle, Minus } from "lucide-react";
import { TagDefinition } from "../../../../../features/tags/entity";

type TagBadgeProps = {
  tag: TagDefinition;
  selectionState?: SelectionState;
  onClick?: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  selectionMode?: "checkbox" | "radio";
};

export const TagBadge = ({
  tag,
  selectionState,
  onClick,
  variant = "secondary",
  className,
  selectionMode = "checkbox",
}: TagBadgeProps) => {
  const getIcon = () => {
    if (selectionMode === "radio") {
      return selectionState === "checked" ? (
        <Circle className="w-3 h-3 fill-current" />
      ) : (
        <Circle className="w-3 h-3" />
      );
    }

    // Checkbox mode (default)
    if (selectionState === "checked") return <Check className="w-3 h-3" />;
    if (selectionState === "indeterminate") return <Minus className="w-3 h-3" />;
    return null;
  };

  const badgeVariant = selectionState === "unchecked" ? variant : "default";

  return (
    <Badge
      variant={badgeVariant}
      className={cn(
        "cursor-pointer transition-colors flex items-center gap-1",
        onClick && "select-none",
        selectionMode === "radio" && "border",
        className
      )}
      size="lg"
      style={{
        backgroundColor: selectionState !== "unchecked" ? tag.color : "transparent",
        borderColor: tag.color || "hsl(var(--border))",
        color: selectionState !== "unchecked" ? "white" : tag.color || "hsl(var(--foreground))",
      }}
      onClick={onClick}
    >
      {getIcon()}
      {tag.displayName}
    </Badge>
  );
};
