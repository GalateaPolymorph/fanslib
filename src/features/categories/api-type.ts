import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Category } from "./entity";

export const methods = ["create", "getAll", "update", "delete"] as const;
export type CategoryHandlers = {
  create: (_: any, name: Category["name"]) => Promise<Category>;
  getAll: (_: any) => Promise<Category[]>;
  update: (_: any, id: string, updates: Partial<Category>) => Promise<Category | null>;
  delete: (_: any, id: string) => Promise<void>;
};

export const namespace = "category" as const;
export const categoryMethods = methods.map((m) => prefixNamespace(namespace, m));
export type CategoryIpcChannel = keyof PrefixNamespace<CategoryHandlers, typeof namespace>;
export type CategoryIpcHandlers = {
  [K in CategoryIpcChannel]: CategoryHandlers[StripNamespace<K, typeof namespace>];
};
