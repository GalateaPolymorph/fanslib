import { Check, Minus } from "lucide-react";
import { TagDefinition } from "../../../../features/tags/entity";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { SelectionState } from "./types";

type TagBadgeProps = {
  tag: TagDefinition;
  selectionState?: SelectionState;
  onClick?: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
};

export const TagBadge = ({
  tag,
  selectionState,
  onClick,
  variant = "secondary",
  className,
}: TagBadgeProps) => {
  const getIcon = () => {
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
        className
      )}
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
