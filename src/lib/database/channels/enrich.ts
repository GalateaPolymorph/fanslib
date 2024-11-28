import { CHANNEL_TYPES } from "./channelTypes";
import { Channel, RawChannel } from "./type";

export const enrichChannel = async (channel: RawChannel): Promise<Channel | null> => {
  const channelType = CHANNEL_TYPES[channel.typeId];
  if (!channelType) return null;

  return {
    ...channel,
    type: channelType,
  };
};
