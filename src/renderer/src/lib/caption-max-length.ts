import { ChannelType } from "src/features/channels/entity";

export const captionMaxLength = (channelType: ChannelType) => {
  if (channelType.id === "bluesky") return 300;
  return Infinity;
};
