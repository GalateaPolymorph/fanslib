import { ChevronDown, ChevronRight, Edit, Filter, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { FilterItem, MediaFilters } from "../../../../features/library/api-type";
import {
  addFilterItemToGroup,
  createFilterGroup,
  filterItemToString,
  removeFilterItemFromGroup,
  updateFilterItemInGroup,
} from "../../../../features/library/filter-helpers";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { FilterItemEditor } from "./FilterItemEditor";

type FilterGroupEditorProps = {
  value: MediaFilters;
  onChange: (filters: MediaFilters) => void;
  className?: string;
};

export const FilterGroupEditor = ({ value, onChange, className = "" }: FilterGroupEditorProps) => {
  // Ensure value is always an array to prevent .map() errors
  const filters = Array.isArray(value) ? value : [];

  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0]));
  const [editingItem, setEditingItem] = useState<{
    groupIndex: number;
    itemIndex?: number;
    item?: FilterItem;
  } | null>(null);

  const addGroup = () => {
    const newGroup = createFilterGroup(true, []);
    const newFilters = [...filters, newGroup];
    onChange(newFilters);

    // Expand the new group
    const newGroupIndex = newFilters.length - 1;
    setExpandedGroups((prev) => new Set(prev).add(newGroupIndex));
  };

  const removeGroup = (groupIndex: number) => {
    const newFilters = filters.filter((_, index) => index !== groupIndex);
    onChange(newFilters);

    // Remove from expanded groups
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      newSet.delete(groupIndex);
      return newSet;
    });
  };

  const updateGroupInclude = (groupIndex: number, include: boolean) => {
    const newFilters = filters.map((group, index) =>
      index === groupIndex ? { ...group, include } : group
    );
    onChange(newFilters);
  };

  const toggleGroupExpanded = (groupIndex: number) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupIndex)) {
        newSet.delete(groupIndex);
      } else {
        newSet.add(groupIndex);
      }
      return newSet;
    });
  };

  const startAddingItem = (groupIndex: number) => {
    setEditingItem({ groupIndex });
  };

  const startEditingItem = (groupIndex: number, itemIndex: number, item: FilterItem) => {
    setEditingItem({ groupIndex, itemIndex, item });
  };

  const saveItem = (newItem: FilterItem) => {
    if (!editingItem) return;

    const { groupIndex, itemIndex } = editingItem;
    const newFilters = [...filters];

    if (itemIndex !== undefined) {
      // Editing existing item
      const updatedGroup = updateFilterItemInGroup(filters[groupIndex], itemIndex, newItem);
      newFilters[groupIndex] = updatedGroup;
    } else {
      // Adding new item
      const updatedGroup = addFilterItemToGroup(filters[groupIndex], newItem);
      newFilters[groupIndex] = updatedGroup;
    }

    onChange(newFilters);
    setEditingItem(null);
  };

  const deleteItem = () => {
    if (!editingItem || editingItem.itemIndex === undefined) return;

    const { groupIndex, itemIndex } = editingItem;
    const updatedGroup = removeFilterItemFromGroup(filters[groupIndex], itemIndex);
    const newFilters = [...filters];
    newFilters[groupIndex] = updatedGroup;

    onChange(newFilters);
    setEditingItem(null);
  };

  const cancelEditing = () => {
    setEditingItem(null);
  };

  if (filters.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Groups
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No filter groups created yet</p>
            <Button onClick={addGroup}>
              <Plus className="mr-2 h-4 w-4" />
              Add Filter Group
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Groups ({filters.length})
          </CardTitle>
          <Button onClick={addGroup} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Group
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filters.map((group, groupIndex) => (
          <Card key={groupIndex} className="border-2">
            <Collapsible
              open={expandedGroups.has(groupIndex)}
              onOpenChange={() => toggleGroupExpanded(groupIndex)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedGroups.has(groupIndex) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={group.include}
                          onCheckedChange={(include) => updateGroupInclude(groupIndex, include)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Label className="font-medium">
                          {group.include ? "Include" : "Exclude"}
                        </Label>
                      </div>
                      <Badge variant="outline">
                        {group.items.length} filter{group.items.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeGroup(groupIndex);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 space-y-3">
                  {group.items.length > 0 && (
                    <div className="space-y-2">
                      {group.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center justify-between p-2 rounded border bg-muted/30"
                        >
                          <span className="text-sm">{filterItemToString(item)}</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingItem(groupIndex, itemIndex, item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedGroup = removeFilterItemFromGroup(group, itemIndex);
                                const newFilters = [...filters];
                                newFilters[groupIndex] = updatedGroup;
                                onChange(newFilters);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {editingItem?.groupIndex === groupIndex && (
                    <>
                      {group.items.length > 0 && <Separator />}
                      <FilterItemEditor
                        item={editingItem.item}
                        onSave={saveItem}
                        onCancel={cancelEditing}
                        onDelete={editingItem.itemIndex !== undefined ? deleteItem : undefined}
                        isEditing={editingItem.itemIndex !== undefined}
                      />
                    </>
                  )}

                  {(!editingItem || editingItem.groupIndex !== groupIndex) && (
                    <>
                      {group.items.length > 0 && <Separator />}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startAddingItem(groupIndex)}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Filter
                      </Button>
                    </>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};
