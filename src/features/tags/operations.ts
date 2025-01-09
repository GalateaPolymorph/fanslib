import { db } from "../../lib/db";
import { CreateTagDto, UpdateTagDto } from "./api-type";
import { Tag } from "./entity";

const normalizeHashtags = (hashtags: string[] = []): string[] => {
  return hashtags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
};

export const createTag = async (dto: CreateTagDto): Promise<Tag> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Tag);
  const tag = repository.create({
    name: dto.name,
    hashtags: normalizeHashtags(dto.hashtags),
  });
  return await repository.save(tag);
};

export const updateTag = async (id: number, dto: UpdateTagDto): Promise<Tag> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Tag);

  const updateData: UpdateTagDto = {
    ...dto,
    hashtags: dto.hashtags ? normalizeHashtags(dto.hashtags) : undefined,
  };

  await repository.update(id, updateData);
  const updatedTag = await repository.findOneBy({ id });
  if (!updatedTag) {
    throw new Error(`Tag with id ${id} not found`);
  }
  return updatedTag;
};

export const deleteTag = async (id: number): Promise<void> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Tag);
  const result = await repository.delete(id);
  if (result.affected === 0) {
    throw new Error(`Tag with id ${id} not found`);
  }
};

export const getTags = async (): Promise<Tag[]> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Tag);
  return await repository.find();
};

export const getTag = async (id: number): Promise<Tag> => {
  const dataSource = await db();
  const repository = dataSource.getRepository(Tag);
  const tag = await repository.findOneBy({ id });
  if (!tag) {
    throw new Error(`Tag with id ${id} not found`);
  }
  return tag;
};
