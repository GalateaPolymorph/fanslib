import { db } from "../../lib/db";
import { findOrCreateHashtags } from "../hashtags/operations";
import { CreateNicheDto, UpdateNicheDto } from "./api-type";
import { Niche } from "./entity";

export const createNiche = async (dto: CreateNicheDto): Promise<Niche> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Niche);

  // Create the niche
  const niche = repository.create({ name: dto.name });

  // Create or find hashtags
  if (dto.hashtags?.length) {
    niche.hashtags = await findOrCreateHashtags(dto.hashtags);
  }

  // Save with hashtag relations
  await repository.save(niche);

  // Return with relations loaded
  return repository.findOne({
    where: { id: niche.id },
    relations: { hashtags: true },
  });
};

export const updateNiche = async (id: number, dto: UpdateNicheDto): Promise<Niche> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Niche);

  // Find existing niche with relations
  const niche = await repository.findOne({
    where: { id },
    relations: { hashtags: true },
  });

  if (!niche) {
    throw new Error(`Niche with id ${id} not found`);
  }

  // Update basic properties
  if (dto.name) {
    niche.name = dto.name;
  }

  // Update hashtags if provided
  if (dto.hashtags !== undefined) {
    niche.hashtags = await findOrCreateHashtags(dto.hashtags);
  }

  // Save the updated niche
  await repository.save(niche);

  // Return with relations loaded
  return repository.findOne({
    where: { id },
    relations: { hashtags: true },
  });
};

export const deleteNiche = async (id: number): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Niche);
  await repository.delete(id);
};

export const getNiches = async (): Promise<Niche[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Niche);
  return repository.find({
    relations: {
      hashtags: {
        channelStats: true,
      },
    },
  });
};

export const getNiche = async (id: number): Promise<Niche> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Niche);
  const niche = await repository.findOneBy({ id });
  if (!niche) {
    throw new Error(`Niche with id ${id} not found`);
  }
  return niche;
};
