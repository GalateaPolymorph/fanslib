import { db } from "../../lib/db";
import { CreateFilterPresetPayload, UpdateFilterPresetPayload } from "./api-type";
import { FilterPreset } from "./entity";
import { validateAndCleanFilters } from "./validation";

export const getAllFilterPresets = async (): Promise<FilterPreset[]> => {
  const database = await db();
  return database.manager.find(FilterPreset, {
    order: { createdAt: "DESC" },
  });
};

export const createFilterPreset = async (
  payload: CreateFilterPresetPayload
): Promise<FilterPreset> => {
  const database = await db();
  const repository = database.getRepository(FilterPreset);

  const preset = repository.create({
    name: payload.name,
    filtersJson: JSON.stringify(payload.filters),
  });

  return repository.save(preset);
};

export const updateFilterPreset = async (
  id: string,
  payload: UpdateFilterPresetPayload
): Promise<FilterPreset | null> => {
  const database = await db();
  const repository = database.getRepository(FilterPreset);

  const preset = await repository.findOne({ where: { id } });
  if (!preset) return null;

  if (payload.name !== undefined) {
    preset.name = payload.name;
  }
  if (payload.filters !== undefined) {
    preset.filtersJson = JSON.stringify(payload.filters);
  }

  return repository.save(preset);
};

export const deleteFilterPreset = async (id: string): Promise<void> => {
  const database = await db();
  const repository = database.getRepository(FilterPreset);

  await repository.delete(id);
};

export const getValidatedFilterPreset = async (id: string): Promise<FilterPreset | null> => {
  const database = await db();
  const repository = database.getRepository(FilterPreset);

  const preset = await repository.findOne({ where: { id } });
  if (!preset) return null;

  // Validate and clean the filters
  const validatedFilters = await validateAndCleanFilters(JSON.parse(preset.filtersJson));

  // If the cleaned filters are different, update the preset
  if (JSON.stringify(validatedFilters) !== preset.filtersJson) {
    preset.filtersJson = JSON.stringify(validatedFilters);
    await repository.save(preset);
  }

  return preset;
};
