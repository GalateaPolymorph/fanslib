import { nanoid } from "nanoid";
import { db } from "../../lib/db";
import { ContentScheduleCreateData, ContentScheduleUpdateData } from "./api-type";
import { ContentSchedule, stringifyMediaFilters } from "./entity";

export const createContentSchedule = async (
  data: ContentScheduleCreateData
): Promise<ContentSchedule> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  const schedule = new ContentSchedule();
  const now = new Date().toISOString();

  const mediaFilters = data.mediaFilters ? stringifyMediaFilters(data.mediaFilters) : undefined;

  Object.assign(schedule, {
    ...data,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
    mediaFilters,
  });

  await repository.save(schedule);

  return repository.findOne({
    where: { id: schedule.id },
    relations: {
      channel: true,
    },
  }) as Promise<ContentSchedule>;
};

export const fetchContentScheduleById = async (id: string): Promise<ContentSchedule | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  return repository.findOne({
    where: { id },
    relations: {
      channel: true,
    },
  });
};

export const fetchContentSchedulesByChannel = async (
  channelId: string
): Promise<ContentSchedule[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  return repository.find({
    where: { channelId },
    relations: {
      channel: true,
    },
    order: {
      createdAt: "DESC",
    },
  });
};

export const fetchAllContentSchedules = async (): Promise<ContentSchedule[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  return repository.find({
    relations: {
      channel: {
        type: true,
      },
    },
    order: {
      createdAt: "DESC",
    },
  });
};

export const updateContentSchedule = async (
  id: string,
  updates: ContentScheduleUpdateData
): Promise<ContentSchedule | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  const schedule = await repository.findOne({
    where: { id },
    relations: {
      channel: true,
    },
  });

  if (!schedule) return null;

  const mediaFiltersString =
    "mediaFilters" in updates
      ? updates.mediaFilters === null
        ? undefined
        : updates.mediaFilters
          ? stringifyMediaFilters(updates.mediaFilters)
          : undefined
      : undefined;

  Object.assign(schedule, {
    ...updates,
    updatedAt: new Date().toISOString(),
    ...(mediaFiltersString !== undefined && { mediaFilters: mediaFiltersString }),
  });

  await repository.save(schedule);

  return repository.findOne({
    where: { id },
    relations: {
      channel: true,
    },
  });
};

export const deleteContentSchedule = async (id: string): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);
  await repository.delete({ id });
};
