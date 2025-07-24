import { prefixNamespaceObject } from "../../lib/namespace";
import type { SnippetHandlers } from "./api-type";
import { namespace } from "./api-type";
import * as operations from "./operations";

export const handlers: SnippetHandlers = {
  getAllSnippets: async (_: unknown) => operations.getAllSnippets(),
  getSnippetsByChannel: async (_: unknown, channelId: string) =>
    operations.getSnippetsByChannel(channelId),
  getGlobalSnippets: async (_: unknown) => operations.getGlobalSnippets(),
  createSnippet: async (_: unknown, data) => operations.createSnippet(data),
  updateSnippet: async (_: unknown, id: string, data) => operations.updateSnippet(id, data),
  deleteSnippet: async (_: unknown, id: string) => operations.deleteSnippet(id),
  incrementUsage: async (_: unknown, id: string) => operations.incrementUsage(id),
};

export const snippetHandlers = prefixNamespaceObject(namespace, handlers);
