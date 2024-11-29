import { fetchCategoryBySlug } from "../categories/fetch";
import { Category } from "../categories/type";
import { CHANNEL_TYPES } from "./channelTypes";
import { Channel, RawChannel } from "./type";

export const enrichChannel = async (rawChannel: RawChannel): Promise<Channel | null> => {
  const type = CHANNEL_TYPES[rawChannel.typeId as keyof typeof CHANNEL_TYPES];
  if (!type) {
    return null;
  }

  const categories = rawChannel.categoryIds
    ? await Promise.all(rawChannel.categoryIds.map((slug) => fetchCategoryBySlug(slug))).then(
        (cats) => cats.filter(Boolean) as Category[]
      )
    : [];

  return {
    ...rawChannel,
    type,
    categories,
  };
};
