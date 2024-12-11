import { db } from "../../lib/db";
import { ChannelCreatePayload } from "./api-type";
import { Channel, ChannelType } from "./entity";

export const createChannel = async ({
  name,
  typeId,
  description,
}: ChannelCreatePayload): Promise<Channel> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Channel);

  const channel = new Channel();
  channel.name = name;
  channel.typeId = typeId;
  channel.description = description;

  // Save and return with type relation loaded
  const { id } = await repository.save(channel);
  return repository.findOne({
    where: { id },
    relations: { type: true },
  });
};

export const createChannelType = async (
  id: string,
  name: string,
  color?: string
): Promise<ChannelType> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ChannelType);

  const channelType = new ChannelType();
  channelType.id = id;
  channelType.name = name;
  channelType.color = color;

  return repository.save(channelType);
};

export const fetchChannelById = async (id: string): Promise<Channel | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Channel);

  return repository.findOne({
    where: { id },
    relations: { type: true },
  });
};

export const fetchAllChannels = async (): Promise<Channel[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Channel);

  return repository.find({
    relations: { type: true },
  });
};

export const fetchChannelsByType = async (typeId: string): Promise<Channel[]> => {
  const dataSource = await db();
  return dataSource
    .createQueryBuilder(Channel, "channel")
    .leftJoinAndSelect("channel.type", "type")
    .where("channel.typeId = :typeId", { typeId })
    .getMany();
};

export const updateChannel = async (
  id: string,
  updates: Partial<Omit<Channel, "id" | "type">>
): Promise<Channel | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Channel);

  const channel = await repository.findOne({
    where: { id },
    relations: { type: true },
  });

  if (!channel) return null;

  // Apply updates
  Object.assign(channel, updates);

  // Save the entity
  await repository.save(channel);

  // Return with relations
  return repository.findOne({
    where: { id },
    relations: { type: true },
  });
};

export const deleteChannel = async (id: string): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Channel);
  await repository.delete({ id });
};
