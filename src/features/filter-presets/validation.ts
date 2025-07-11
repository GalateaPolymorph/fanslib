import { db } from "../../lib/db";
import { Channel } from "../channels/entity";
import { FilterItem, MediaFilters } from "../library/api-type";
import { Shoot } from "../shoots/entity";
import { TagDefinition } from "../tags/entity";

const validateFilterItem = async (item: FilterItem): Promise<boolean> => {
  const database = await db();

  switch (item.type) {
    case "channel": {
      if (!item.id) return false;
      const channel = await database.manager.findOne(Channel, { where: { id: item.id } });
      return !!channel;
    }
    case "subreddit": {
      // Subreddits are stored in Channel table with specific type
      if (!item.id) return false;
      const subreddit = await database.manager.findOne(Channel, { 
        where: { id: item.id },
        relations: { type: true }
      });
      return !!subreddit && subreddit.type?.name === "reddit";
    }
    case "tag": {
      if (!item.id) return false;
      const tag = await database.manager.findOne(TagDefinition, { where: { id: parseInt(item.id) } });
      return !!tag;
    }
    case "shoot": {
      if (!item.id) return false;
      const shoot = await database.manager.findOne(Shoot, { where: { id: item.id } });
      return !!shoot;
    }
    case "filename":
    case "caption":
    case "posted":
    case "mediaType":
    case "createdDateStart":
    case "createdDateEnd":
    case "dimensionEmpty":
      // These filter types don't reference external entities, so they're always valid
      return true;
    default:
      return false;
  }
};

export const validateAndCleanFilters = async (filters: MediaFilters): Promise<MediaFilters> => {
  const cleanedFilters: MediaFilters = [];

  for (const group of filters) {
    const validItems: FilterItem[] = [];
    
    for (const item of group.items) {
      const isValid = await validateFilterItem(item);
      if (isValid) {
        validItems.push(item);
      }
    }

    // Only keep groups that have at least one valid item
    if (validItems.length > 0) {
      cleanedFilters.push({
        include: group.include,
        items: validItems,
      });
    }
  }

  return cleanedFilters;
};