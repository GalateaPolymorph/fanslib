import { Filter, FilterX, X } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { FilterDropdown } from "./FilterDropdown";
import { FilterItemRenderer } from "./FilterItemRenderer";
import { useMediaFilters } from "./MediaFiltersContext";

type FilterGroupEditorProps = {
  className?: string;
};

export const FilterGroupEditor = ({ className = "" }: FilterGroupEditorProps) => {
  const { filters, removeGroup, updateGroupInclude, updateFilterInGroup, removeFilterFromGroup } =
    useMediaFilters();

  return (
    <TooltipProvider>
      <div className={`${className} space-y-2`}>
        {filters.map((group, groupIndex) => (
          <div key={groupIndex} className="border rounded-lg">
            <div className="px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateGroupInclude(groupIndex, !group.include)}
                      >
                        {group.include ? (
                          <Filter className="h-4 w-4 text-green-700" />
                        ) : (
                          <FilterX className="h-4 w-4 text-red-700" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{group.include ? "Include filters" : "Exclude filters"}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {group.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex-shrink-0">
                      <FilterItemRenderer
                        type={item.type}
                        value={item}
                        onChange={(newItem) => updateFilterInGroup(groupIndex, itemIndex, newItem)}
                        onRemove={() => removeFilterFromGroup(groupIndex, itemIndex)}
                      />
                    </div>
                  ))}
                  <div className="flex-shrink-0">
                    <FilterDropdown groupIndex={groupIndex} variant="compact" />
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeGroup(groupIndex)}
                        className="h-9 w-9"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove group</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};
