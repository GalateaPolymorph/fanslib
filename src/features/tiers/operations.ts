import { DataSource, Repository } from "typeorm";
import { db } from "../../lib/db";
import { CreateTierDto, UpdateTierDto } from "./api-type";
import { Tier } from "./entity";

const validateLevel = (level: number) => {
  if (!Number.isInteger(level)) {
    throw new Error("Level must be an integer");
  }
  if (level < 0) {
    throw new Error("Level cannot be negative");
  }
};

const executeWithLock = async <T>(
  dataSource: DataSource,
  callback: () => Promise<T>
): Promise<T> => {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await callback();
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

const shiftTierLevels = async (repository: Repository<Tier>, fromLevel: number) => {
  const tiers = await repository.find({
    order: { level: "ASC" },
  });

  const tiersToUpdate = tiers.filter((tier) => tier.level >= fromLevel);

  for (const tier of tiersToUpdate) {
    await repository.update(tier.id, { level: tier.level + 1 });
  }
};

const consolidateLevels = async (repository: Repository<Tier>) => {
  const tiers = await repository.find({
    order: { level: "ASC" },
  });

  const updates = tiers.map((tier, index) => ({
    id: tier.id,
    level: index,
  }));

  return Promise.all(
    updates.map((update) => repository.update(update.id, { level: update.level }))
  );
};

export const createTier = async (dto: CreateTierDto): Promise<Tier> => {
  validateLevel(dto.level);

  const dataSource = await db();
  return executeWithLock(dataSource, async () => {
    const repository = dataSource.getRepository(Tier);

    const maxLevel = (await repository.maximum("level")) ?? -1;
    if (dto.level > maxLevel + 1) {
      dto.level = maxLevel + 1;
    }

    await shiftTierLevels(repository, dto.level);

    const tier = repository.create({
      name: dto.name,
      level: dto.level,
    });
    const savedTier = await repository.save(tier);
    await consolidateLevels(repository);
    return savedTier;
  });
};

export const updateTier = async (id: number, dto: UpdateTierDto): Promise<Tier> => {
  if (dto.level !== undefined) {
    validateLevel(dto.level);
  }

  const dataSource = await db();
  return executeWithLock(dataSource, async () => {
    const repository = dataSource.getRepository(Tier);

    const currentTier = await repository.findOneBy({ id });
    if (!currentTier) {
      throw new Error(`Tier with id ${id} not found`);
    }

    if (dto.level !== undefined) {
      const maxLevel = (await repository.maximum("level")) ?? 0;
      if (dto.level > maxLevel && currentTier.level !== maxLevel) {
        dto.level = maxLevel;
      }

      if (currentTier.level !== dto.level) {
        await shiftTierLevels(repository, dto.level);
      }
    }

    await repository.update(id, dto);
    await consolidateLevels(repository);
    const updatedTier = await repository.findOneBy({ id });
    if (!updatedTier) {
      throw new Error(`Tier with id ${id} not found`);
    }
    return updatedTier;
  });
};

export const deleteTier = async (id: number): Promise<void> => {
  const dataSource = await db();
  return executeWithLock(dataSource, async () => {
    const repository = dataSource.getRepository(Tier);

    const tierToDelete = await repository.findOneBy({ id });
    if (!tierToDelete) {
      throw new Error(`Tier with id ${id} not found`);
    }

    const result = await repository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Tier with id ${id} not found`);
    }

    await consolidateLevels(repository);
  });
};

export const getTiers = async (): Promise<Tier[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Tier);
  return await repository.find({ order: { level: "ASC" } });
};

export const getTier = async (id: number): Promise<Tier> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Tier);
  const tier = await repository.findOneBy({ id });
  if (!tier) {
    throw new Error(`Tier with id ${id} not found`);
  }
  return tier;
};
