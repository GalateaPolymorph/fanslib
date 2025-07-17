import { Channel } from "../features/channels/entity";
import { db } from "../lib/db";

const CHANNEL_FIXTURES: Omit<Channel, "createdAt" | "updatedAt" | "type" | "defaultHashtags">[] = [
  {
    id: "fansly",
    name: "Fansly",
    typeId: "fansly",
  },
  {
    id: "onlyfans",
    name: "OnlyFans",
    typeId: "onlyfans",
  },
  {
    id: "x",
    name: "X",
    typeId: "x",
  },
  {
    id: "reddit-promo",
    name: "Reddit Promo",
    typeId: "reddit",
  },
  {
    id: "instagram",
    name: "Instagram",
    typeId: "instagram",
  },
  {
    id: "manyvids",
    name: "ManyVids",
    typeId: "manyvids",
  },
  {
    id: "bluesky",
    name: "BlueSky",
    typeId: "bluesky",
  },
  {
    id: "redgifs",
    name: "RedGIFs",
    typeId: "redgifs",
  },
];

export const loadChannelFixtures = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Channel);
  const existingChannels = await repository.find();

  const channelPromises = CHANNEL_FIXTURES.map(async (channel) => {
    if (existingChannels.find((c) => c.id === channel.id)) {
      return null;
    }
    return repository.save(channel);
  });

  await Promise.all(channelPromises);
};
