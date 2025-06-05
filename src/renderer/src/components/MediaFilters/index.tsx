import { MediaFilters as MediaFiltersType } from "../../../../features/library/api-type";
import { cn } from "../../lib/utils";
import { FilterDropdown } from "./FilterDropdown";
import { FilterGroupEditor } from "./FilterGroupEditor";
import { MediaFiltersProvider, useMediaFilters } from "./MediaFiltersContext";

type MediaFiltersProps = {
  value: MediaFiltersType;
  onChange: (filters: MediaFiltersType) => void;
  className?: string;
};

const MediaFiltersContent = ({
  className = "",
}: {
  showClearButton?: boolean;
  className?: string;
}) => {
  const { filters } = useMediaFilters();

  if (filters.length === 0) {
    return (
      <div className={cn("flex-grow", className)}>
        <FilterDropdown />
      </div>
    );
  }

  return <FilterGroupEditor className="w-full flex-grow" />;
};

export const MediaFilters = ({ value, onChange, className = "" }: MediaFiltersProps) => {
  return (
    <MediaFiltersProvider value={value} onChange={onChange}>
      <MediaFiltersContent className={className} />
    </MediaFiltersProvider>
  );
};

export { FilterActions } from "./FilterActions";
export { RedditChannelFilterPreset } from "./RedditChannelFilterPreset";
