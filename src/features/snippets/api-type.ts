import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import type { CaptionSnippet } from "./entity";

export type SnippetCreateData = {
  name: string;
  content: string;
  channelId?: string;
};

export type SnippetUpdateData = {
  name?: string;
  content?: string;
  channelId?: string;
};

export const methods = [
  "getAllSnippets",
  "getSnippetsByChannel", 
  "getGlobalSnippets",
  "createSnippet",
  "updateSnippet",
  "deleteSnippet",
  "incrementUsage",
] as const;

export type SnippetHandlers = {
  getAllSnippets: (_: unknown) => Promise<CaptionSnippet[]>;
  getSnippetsByChannel: (_: unknown, channelId: string) => Promise<CaptionSnippet[]>;
  getGlobalSnippets: (_: unknown) => Promise<CaptionSnippet[]>;
  createSnippet: (_: unknown, data: SnippetCreateData) => Promise<CaptionSnippet>;
  updateSnippet: (_: unknown, id: string, data: SnippetUpdateData) => Promise<CaptionSnippet>;
  deleteSnippet: (_: unknown, id: string) => Promise<void>;
  incrementUsage: (_: unknown, id: string) => Promise<void>;
};

export const namespace = "snippet" as const;
export const snippetMethods = methods.map((m) => prefixNamespace(namespace, m));
export type SnippetIpcChannel = keyof PrefixNamespace<SnippetHandlers, typeof namespace>;
export type SnippetIpcHandlers = {
  [K in SnippetIpcChannel]: SnippetHandlers[StripNamespace<K, typeof namespace>];
};