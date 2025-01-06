import { nanoid } from "nanoid";
import { db } from "../../lib/db";
import { ContentScheduleCreateData } from "./api-type";
import { ContentSchedule } from "./entity";

export const createContentSchedule = async (
  data: ContentScheduleCreateData
): Promise<ContentSchedule> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  const schedule = new ContentSchedule();
  const now = new Date().toISOString();

  Object.assign(schedule, {
    ...data,
    id: nanoid(),
    createdAt: now,
    updatedAt: now,
  });

  await repository.save(schedule);

  return repository.findOne({
    where: { id: schedule.id },
    relations: {
      channel: true,
      category: true,
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
      category: true,
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
      category: true,
    },
    order: {
      createdAt: "DESC",
    },
  });
};

export const fetchContentSchedulesByCategory = async (
  categoryId: string
): Promise<ContentSchedule[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  return repository.find({
    where: { categoryId },
    relations: {
      channel: true,
      category: true,
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
      channel: true,
      category: true,
    },
    order: {
      createdAt: "DESC",
    },
  });
};

export const updateContentSchedule = async (
  id: string,
  updates: Partial<Omit<ContentSchedule, "id" | "createdAt" | "updatedAt" | "channel" | "category">>
): Promise<ContentSchedule | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  const schedule = await repository.findOne({
    where: { id },
    relations: {
      channel: true,
      category: true,
    },
  });

  if (!schedule) return null;

  // Apply updates with timestamp
  Object.assign(schedule, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  // Save the entity
  await repository.save(schedule);

  // Return with relations
  return repository.findOne({
    where: { id },
    relations: {
      channel: true,
      category: true,
    },
  });
};

export const deleteContentSchedule = async (id: string): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);
  await repository.delete({ id });
};
