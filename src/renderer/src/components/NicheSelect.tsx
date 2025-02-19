import { Badge } from "@renderer/components/ui/badge";
import { useNiches } from "../contexts/NicheContext";
import { cn } from "../lib/utils";
export type NicheSelectionState = {
  id: number;
  state: "selected" | "half-selected" | "unselected";
};

type NicheSelectProps = {
  value?: NicheSelectionState[];
  onChange: (nicheStates: NicheSelectionState[] | undefined, changedNicheId: number) => void;
  multiple?: boolean;
  disabledNiches?: number[];
  includeNoneOption?: boolean;
  size?: "default" | "sm" | "lg";
};

export const NicheSelect = ({
  value = [],
  onChange,
  multiple = true,
  disabledNiches = [],
  includeNoneOption = false,
  size = "default",
}: NicheSelectProps) => {
  const { niches, isLoading } = useNiches();

  const getNicheState = (id: number): "selected" | "half-selected" | "unselected" => {
    const nicheState = value.find((n) => n.id === id);
    return nicheState?.state ?? "unselected";
  };

  const toggleNiche = (id: number) => {
    if (disabledNiches.includes(id)) return;

    const currentState = getNicheState(id);
    const newState: NicheSelectionState["state"] =
      currentState === "unselected" || currentState === "half-selected" ? "selected" : "unselected";

    const otherNiches = value.filter((n) => n.id !== id);

    if (newState === "unselected") {
      if (otherNiches.length === 0) {
        if (multiple) {
          onChange([{ id, state: "unselected" }], id);
          return;
        }
        onChange(undefined, id);
        return;
      }
      onChange(otherNiches, id);
      return;
    }

    if (multiple) {
      onChange([...otherNiches, { id, state: newState }], id);
      return;
    }

    onChange([{ id, state: newState }], id);
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading niches...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {niches.map((niche) => {
        const isDisabled = disabledNiches.includes(niche.id);
        const state = getNicheState(niche.id);

        return (
          <Badge
            key={niche.id}
            size={size}
            shape="tag"
            variant={
              state === "selected"
                ? "default"
                : state === "half-selected"
                  ? "halfSelected"
                  : "outline"
            }
            className={cn(
              "transition-colors cursor-pointer",
              !multiple && value.length > 0 && state === "unselected" && "opacity-50",
              isDisabled && "opacity-30 cursor-not-allowed"
            )}
            onClick={() => toggleNiche(niche.id)}
          >
            {niche.name}
          </Badge>
        );
      })}
      {includeNoneOption && (
        <Badge
          variant={value?.length === 0 ? "default" : "outline"}
          className={cn(
            "transition-colors cursor-pointer text-muted-foreground",
            !multiple && value?.length > 0 && "opacity-50"
          )}
          onClick={() => {
            if (Array.isArray(value)) {
              onChange(undefined, -1);
              return;
            }
            onChange([], -1);
          }}
          style={{
            backgroundColor: value?.length === 0 ? "hsl(var(--muted))" : "transparent",
            borderColor: "hsl(var(--muted))",
          }}
        >
          None
        </Badge>
      )}
    </div>
  );
};
