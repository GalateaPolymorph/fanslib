import { X } from "lucide-react";
import { ChannelSelect } from "../../ChannelSelect";
import { Button } from "../../ui/button";

type EligibleChannelFilterContentProps = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export const EligibleChannelFilterContent = ({
  value,
  onChange,
}: EligibleChannelFilterContentProps) => {
  const handleChannelChange = (channelIds: string[]) => {
    onChange(channelIds.length > 0 ? channelIds[0] : undefined);
  };

  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1">
        <ChannelSelect
          value={value ? [value] : []}
          onChange={handleChannelChange}
          multiple={false}
          selectable={true}
        />
      </div>
      {value && (
        <Button variant="ghost" size="icon" onClick={handleClear} className="h-7 w-7 shrink-0">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
