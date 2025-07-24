import { db } from "../../lib/db";
import type { SnippetCreateData, SnippetUpdateData } from "./api-type";
import { CaptionSnippet } from "./entity";

export const getAllSnippets = async () => {
  const dataSource = await db();
  const repo = dataSource.getRepository(CaptionSnippet);
  return repo.find({
    relations: ["channel"],
    order: { usageCount: "DESC", updatedAt: "DESC" },
  });
};

export const getSnippetsByChannel = async (channelId: string) => {
  const dataSource = await db();
  const repo = dataSource.getRepository(CaptionSnippet);
  return repo.find({
    where: [
      { channelId },
      { channelId: undefined }, // Include global snippets
    ],
    relations: ["channel"],
    order: { usageCount: "DESC", updatedAt: "DESC" },
  });
};

export const getGlobalSnippets = async () => {
  const dataSource = await db();
  const repo = dataSource.getRepository(CaptionSnippet);
  return repo.find({
    where: { channelId: undefined },
    order: { usageCount: "DESC", updatedAt: "DESC" },
  });
};

export const createSnippet = async (data: SnippetCreateData) => {
  const dataSource = await db();
  const repo = dataSource.getRepository(CaptionSnippet);

  // Check for duplicate names in the same scope (global or channel-specific)
  const existing = await repo.findOne({
    where: {
      name: data.name,
      channelId: data.channelId || undefined,
    },
  });

  if (existing) {
    throw new Error(
      data.channelId
        ? "A snippet with this name already exists for this channel"
        : "A global snippet with this name already exists"
    );
  }

  const snippet = repo.create(data);
  return repo.save(snippet);
};

export const updateSnippet = async (id: string, data: SnippetUpdateData) => {
  const dataSource = await db();
  const repo = dataSource.getRepository(CaptionSnippet);

  const snippet = await repo.findOneOrFail({ where: { id } });

  // Check for duplicate names if name is being changed
  if (data.name && data.name !== snippet.name) {
    const existing = await repo.findOne({
      where: {
        name: data.name,
        channelId: data.channelId !== undefined ? data.channelId : snippet.channelId,
      },
    });

    if (existing && existing.id !== id) {
      throw new Error(
        data.channelId !== undefined
          ? "A snippet with this name already exists for this channel"
          : "A global snippet with this name already exists"
      );
    }
  }

  Object.assign(snippet, data);
  return repo.save(snippet);
};

export const deleteSnippet = async (id: string) => {
  const dataSource = await db();
  const repo = dataSource.getRepository(CaptionSnippet);
  await repo.delete(id);
};

export const incrementUsage = async (id: string) => {
  const dataSource = await db();
  const repo = dataSource.getRepository(CaptionSnippet);
  await repo.increment({ id }, "usageCount", 1);
};
