import { createContext, ReactNode, useContext } from "react";
import {
  FilterItem,
  MediaFilters as MediaFiltersType,
} from "../../../../features/library/api-type";
import {
  addFilterItemToGroup,
  removeFilterItemFromGroup,
  updateFilterItemInGroup,
} from "../../../../features/library/filter-helpers";

type MediaFiltersContextValue = {
  // State
  filters: MediaFiltersType;

  // Actions
  onChange: (filters: MediaFiltersType) => void;
  removeGroup: (groupIndex: number) => void;
  updateGroupInclude: (groupIndex: number, include: boolean) => void;
  addGroupWithFilterType: (filterType: FilterItem["type"]) => void;
  addEmptyGroup: () => void;
  addFilterToGroup: (groupIndex: number, item: FilterItem) => void;
  addFilterWithTypeToGroup: (groupIndex: number, filterType: FilterItem["type"]) => void;
  updateFilterInGroup: (groupIndex: number, itemIndex: number, item: FilterItem) => void;
  removeFilterFromGroup: (groupIndex: number, itemIndex: number) => void;
  clearFilters: () => void;

  // Computed
  hasActiveFilters: boolean;
};

const MediaFiltersContext = createContext<MediaFiltersContextValue | null>(null);

type MediaFiltersProviderProps = {
  value: MediaFiltersType;
  onChange: (filters: MediaFiltersType) => void;
  children: ReactNode;
};

const normalizeFilters = (value: unknown): MediaFiltersType => {
  if (!Array.isArray(value)) return [];

  return value.filter((group): group is any => group && typeof group === "object");
};

export const MediaFiltersProvider = ({ value, onChange, children }: MediaFiltersProviderProps) => {
  const filters = normalizeFilters(value);

  const hasActiveFilters = filters.length > 0 && filters.some((group) => group.items.length > 0);

  const addGroupWithFilterType = (filterType: FilterItem["type"]) => {
    let defaultItem: FilterItem;

    switch (filterType) {
      case "channel":
      case "subreddit":
      case "tag":
      case "shoot":
        defaultItem = { type: filterType, id: "" };
        break;
      case "filename":
      case "caption":
        defaultItem = { type: filterType, value: "" };
        break;
      case "posted":
        defaultItem = { type: filterType, value: false };
        break;
      case "mediaType":
        defaultItem = { type: filterType, value: "image" };
        break;
      case "createdDateStart":
      case "createdDateEnd":
        defaultItem = { type: filterType, value: new Date() };
        break;
      default:
        defaultItem = { type: "filename", value: "" };
    }

    console.log("defaultItem", defaultItem);
    onChange([
      ...filters,
      {
        include: true,
        items: [defaultItem],
      },
    ]);
  };

  const addEmptyGroup = () => {
    onChange([...filters, { include: true, items: [] }]);
  };

  const removeGroup = (groupIndex: number) => {
    const newFilters = filters.filter((_, index) => index !== groupIndex);
    onChange(newFilters);
  };

  const updateGroupInclude = (groupIndex: number, include: boolean) => {
    const newFilters = filters.map((group, index) =>
      index === groupIndex ? { ...group, include } : group
    );
    onChange(newFilters);
  };

  const addFilterToGroup = (groupIndex: number, item: FilterItem) => {
    const newFilters = [...filters];
    const updatedGroup = addFilterItemToGroup(filters[groupIndex], item);
    newFilters[groupIndex] = updatedGroup;
    console.log("newFilters", newFilters);
    onChange(newFilters);
  };

  const addFilterWithTypeToGroup = (groupIndex: number, filterType: FilterItem["type"]) => {
    // Create a default filter item based on the type
    let defaultItem: FilterItem;

    switch (filterType) {
      case "channel":
      case "subreddit":
      case "tag":
      case "shoot":
        defaultItem = { type: filterType, id: "" };
        break;
      case "filename":
      case "caption":
        defaultItem = { type: filterType, value: "" };
        break;
      case "posted":
        defaultItem = { type: filterType, value: false };
        break;
      case "mediaType":
        defaultItem = { type: filterType, value: "image" };
        break;
      case "createdDateStart":
      case "createdDateEnd":
        defaultItem = { type: filterType, value: new Date() };
        break;
      default:
        defaultItem = { type: "filename", value: "" };
    }

    addFilterToGroup(groupIndex, defaultItem);
  };

  const updateFilterInGroup = (groupIndex: number, itemIndex: number, item: FilterItem) => {
    const newFilters = [...filters];
    const updatedGroup = updateFilterItemInGroup(filters[groupIndex], itemIndex, item);
    newFilters[groupIndex] = updatedGroup;
    onChange(newFilters);
  };

  const removeFilterFromGroup = (groupIndex: number, itemIndex: number) => {
    const newFilters = [...filters];
    const updatedGroup = removeFilterItemFromGroup(filters[groupIndex], itemIndex);
    newFilters[groupIndex] = updatedGroup;
    onChange(newFilters);
  };

  const clearFilters = () => {
    onChange([]);
  };

  const contextValue: MediaFiltersContextValue = {
    // State
    filters,

    // Actions
    onChange,
    addGroupWithFilterType,
    addEmptyGroup,
    removeGroup,
    updateGroupInclude,
    addFilterToGroup,
    addFilterWithTypeToGroup,
    updateFilterInGroup,
    removeFilterFromGroup,
    clearFilters,

    // Computed
    hasActiveFilters,
  };

  return (
    <MediaFiltersContext.Provider value={contextValue}>{children}</MediaFiltersContext.Provider>
  );
};

export const useMediaFilters = () => {
  const context = useContext(MediaFiltersContext);
  if (!context) {
    throw new Error("useMediaFilters must be used within a MediaFiltersProvider");
  }
  return context;
};
