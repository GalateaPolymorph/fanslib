import { CHANNEL_TYPES } from "./channelTypes";
import { Channel, RawChannel } from "./type";

export const enrichChannel = async (rawChannel: RawChannel): Promise<Channel | null> => {
  const type = CHANNEL_TYPES[rawChannel.typeId as keyof typeof CHANNEL_TYPES];
  if (!type) {
    return null;
  }

  return {
    ...rawChannel,
    type,
  };
};
