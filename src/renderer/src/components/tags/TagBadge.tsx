import { TagDefinition } from "../../../../features/tags/entity";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/badge";

type TagBadgeProps = {
  tag: TagDefinition;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
};

export const TagBadge = ({
  tag,
  isSelected = false,
  onClick,
  variant = "secondary",
  className,
}: TagBadgeProps) => {
  const badgeVariant = isSelected ? "default" : variant;

  return (
    <Badge
      variant={badgeVariant}
      className={cn("cursor-pointer transition-colors", onClick && "select-none", className)}
      style={{
        backgroundColor: isSelected ? tag.color : "transparent",
        borderColor: tag.color || "hsl(var(--border))",
        color: isSelected ? "white" : tag.color || "hsl(var(--foreground))",
      }}
      onClick={onClick}
    >
      {tag.displayName}
    </Badge>
  );
};
