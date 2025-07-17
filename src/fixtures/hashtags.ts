import { Hashtag } from "../features/hashtags/entity";
import { db } from "../lib/db";

const HASHTAG_FIXTURES: Omit<Hashtag, "createdAt" | "updatedAt">[] = [
  {
    id: 1,
    name: "selfie",
    channelStats: [],
  },
  {
    id: 2,
    name: "lingerie",
    channelStats: [],
  },
  {
    id: 3,
    name: "bikini",
    channelStats: [],
  },
  {
    id: 4,
    name: "model",
    channelStats: [],
  },
  {
    id: 5,
    name: "photoshoot",
    channelStats: [],
  },
  {
    id: 6,
    name: "fashion",
    channelStats: [],
  },
  {
    id: 7,
    name: "beauty",
    channelStats: [],
  },
  {
    id: 8,
    name: "lifestyle",
    channelStats: [],
  },
  {
    id: 9,
    name: "fitness",
    channelStats: [],
  },
  {
    id: 10,
    name: "workout",
    channelStats: [],
  },
  {
    id: 11,
    name: "cosplay",
    channelStats: [],
  },
  {
    id: 12,
    name: "art",
    channelStats: [],
  },
  {
    id: 13,
    name: "creative",
    channelStats: [],
  },
  {
    id: 14,
    name: "mood",
    channelStats: [],
  },
  {
    id: 15,
    name: "vibes",
    channelStats: [],
  },
];

export const loadHashtagFixtures = async () => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Hashtag);
  const existingHashtags = await repository.find();

  const hashtagPromises = HASHTAG_FIXTURES.map(async (hashtag) => {
    if (existingHashtags.find((h) => h.name === hashtag.name)) {
      return null;
    }
    return repository.save(hashtag);
  });

  await Promise.all(hashtagPromises);
};
