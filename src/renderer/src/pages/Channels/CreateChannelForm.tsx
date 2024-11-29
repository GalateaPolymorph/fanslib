import { ChannelTypeIcon } from "@renderer/components/ChannelTypeIcon";
import { Badge } from "@renderer/components/ui/badge";
import { CHANNEL_TYPES } from "../../../../lib/database/channels/channelTypes";
import { Channel } from "../../../../lib/database/channels/type";

interface CreateChannelFormProps {
  onSubmit: (channel: Channel) => void;
  className?: string;
}

export const CreateChannelForm = ({ onSubmit, className = "" }: CreateChannelFormProps) => {
  const handleTypeSelect = async (typeId: keyof typeof CHANNEL_TYPES) => {
    const channel = await window.api.channel.createChannel({
      name: "New Channel",
      description: "",
      typeId,
      categoryIds: [],
    });
    onSubmit(channel);
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(CHANNEL_TYPES).map(([id, type]) => (
          <Badge
            key={id}
            variant="outline"
            className="gap-2 py-1.5 transition-colors hover:opacity-90 cursor-pointer text-white"
            style={{
              backgroundColor: type.color,
              borderColor: type.color,
            }}
            onClick={() => handleTypeSelect(id as keyof typeof CHANNEL_TYPES)}
          >
            <ChannelTypeIcon
              typeId={id as keyof typeof CHANNEL_TYPES}
              color="white"
              className="w-5 h-5"
            />
            <span>{type.name}</span>
          </Badge>
        ))}
      </div>
    </div>
  );
};
