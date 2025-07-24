import { db } from "../../lib/db";
import { CHANNEL_TYPES } from "./channelTypes";
import { ChannelType } from "./entity";

export const loadChannelTypeFixtures = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ChannelType);
  const existingChannelTypes = await repository.find();
  return Promise.all(
    Object.entries(CHANNEL_TYPES).map(async ([id, type]) => {
      if (existingChannelTypes.find((t) => t.id === id)) {
        return null;
      }
      return repository.save(type);
    })
  );
};
