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

export const listShoots = async (
  params?: GetAllShootsParams
): Promise<PaginatedResponse<ShootSummary>> => {
  const database = await db();
  const shootRepository = database.getRepository(Shoot);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  const skip = (page - 1) * limit;

  const queryBuilder = shootRepository
    .createQueryBuilder("shoot")
    .leftJoinAndSelect("shoot.media", "media")
    .leftJoinAndSelect("media.categories", "categories")
    .loadRelationCountAndMap("shoot.mediaCount", "shoot.media");

  if (params?.search) {
    queryBuilder.andWhere(
      "(LOWER(shoot.name) LIKE LOWER(:search) OR LOWER(shoot.description) LIKE LOWER(:search))",
      { search: `%${params.search}%` }
    );
  }

  const [items, total] = await queryBuilder
    .skip(skip)
    .take(limit)
    .orderBy("shoot.shootDate", "DESC")
    .getManyAndCount();

  return {
    items: items as (Shoot & { mediaCount: number })[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
