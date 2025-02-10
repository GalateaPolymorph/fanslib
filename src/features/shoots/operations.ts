import { In } from "typeorm";
import { db } from "../../lib/db";
import { PaginatedResponse } from "../_common/pagination";
import { Media } from "../library/entity";
import {
  CreateShootPayload,
  GetAllShootsParams,
  ShootSummary,
  ShootWithMedia,
  UpdateShootPayload,
} from "./api-type";
import { Shoot } from "./entity";

export const createShoot = async (payload: CreateShootPayload): Promise<ShootWithMedia> => {
  const database = await db();
  const mediaRepository = database.getRepository(Media);
  const shootRepository = database.getRepository(Shoot);

  const media = await mediaRepository.findBy({
    id: In(payload.mediaIds),
  });

  const shoot = shootRepository.create({
    name: payload.name,
    description: payload.description,
    shootDate: payload.shootDate,
    media,
  });

  await shootRepository.save(shoot);
  return shoot;
};

export const getShoot = async (id: string): Promise<ShootWithMedia | null> => {
  const database = await db();
  const shootRepository = database.getRepository(Shoot);

  return shootRepository.findOne({
    where: { id },
    relations: ["media"],
  });
};

export const updateShoot = async (
  id: string,
  payload: UpdateShootPayload
): Promise<ShootWithMedia> => {
  const database = await db();
  const shootRepository = database.getRepository(Shoot);
  const mediaRepository = database.getRepository(Media);

  const shoot = await shootRepository.findOne({
    where: { id },
    relations: ["media"],
  });

  if (!shoot) {
    throw new Error(`Shoot with id ${id} not found`);
  }

  if (payload.mediaIds) {
    const media = await mediaRepository.findBy({
      id: In(payload.mediaIds),
    });
    shoot.media = media;
  }

  Object.assign(shoot, {
    name: payload.name ?? shoot.name,
    description: payload.description ?? shoot.description,
    shootDate: payload.shootDate ?? shoot.shootDate,
  });

  await shootRepository.save(shoot);
  return shoot;
};

export const deleteShoot = async (id: string): Promise<void> => {
  const database = await db();
  const shootRepository = database.getRepository(Shoot);

  await shootRepository.delete(id);
};

export const listShoots = async ({
  page = 1,
  limit = 50,
  filter,
}: GetAllShootsParams): Promise<PaginatedResponse<ShootSummary>> => {
  const database = await db();
  const shootRepository = database.getRepository(Shoot);

  const query = shootRepository
    .createQueryBuilder("shoot")
    .leftJoinAndSelect("shoot.media", "media")
    .leftJoinAndSelect("media.tier", "tier")
    .leftJoinAndSelect("media.postMedia", "postMedia")
    .leftJoinAndSelect("postMedia.post", "post")
    .leftJoinAndSelect("post.channel", "channel")
    .leftJoinAndSelect("media.categories", "categories")
    .loadRelationCountAndMap("shoot.mediaCount", "shoot.media");

  if (filter?.name) {
    query.andWhere("LOWER(shoot.name) LIKE LOWER(:name)", { name: `%${filter.name}%` });
  }

  if (filter?.startDate) {
    // Set time to start of day in UTC
    const startOfDay = new Date(filter.startDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    query.andWhere("DATE(shoot.shootDate) >= DATE(:startDate)", {
      startDate: startOfDay,
    });
  }

  if (filter?.endDate) {
    // Set time to end of day in UTC
    const endOfDay = new Date(filter.endDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    query.andWhere("DATE(shoot.shootDate) <= DATE(:endDate)", {
      endDate: endOfDay,
    });
  }

  const [items, total] = await query
    .skip((page - 1) * limit)
    .take(limit)
    .orderBy("shoot.shootDate", "DESC")
    .getManyAndCount();

  return {
    items: items as (Shoot & { mediaCount: number })[],
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit,
  };
};
