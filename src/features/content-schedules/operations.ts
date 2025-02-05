import { nanoid } from "nanoid";
import { db } from "../../lib/db";
import { Category } from "../categories/entity";
import { Tier } from "../tiers/entity";
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
      tier: true,
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
      tier: true,
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
      tier: true,
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
      tier: true,
    },
    order: {
      createdAt: "DESC",
    },
  });
};

export const updateContentSchedule = async (
  id: string,
  updates: Partial<
    Omit<ContentSchedule, "id" | "createdAt" | "updatedAt" | "channel" | "category" | "tier">
  >
): Promise<ContentSchedule | null> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);

  const schedule = await repository.findOne({
    where: { id },
    relations: {
      channel: true,
      category: true,
      tier: true,
    },
  });

  if (!schedule) return null;

  // Apply updates with timestamp
  Object.assign(schedule, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });

  if (updates.categoryId) {
    schedule.category = await dataSource.getRepository(Category).findOne({
      where: { id: updates.categoryId },
    });
  }
  if (updates.categoryId === null) {
    schedule.category = null;
  }
  if (updates.tierId) {
    schedule.tier = await dataSource.getRepository(Tier).findOne({
      where: { id: updates.tierId },
    });
  }
  if (updates.tierId === null) {
    schedule.tier = null;
  }

  // Save the entity
  await repository.save(schedule);

  // Return with relations
  return repository.findOne({
    where: { id },
    relations: {
      channel: true,
      category: true,
      tier: true,
    },
  });
};

export const deleteContentSchedule = async (id: string): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(ContentSchedule);
  await repository.delete({ id });
};
