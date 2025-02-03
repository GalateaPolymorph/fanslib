import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Tier } from "./entity";

export type CreateTierDto = {
  name: string;
  level: number;
};

export type UpdateTierDto = {
  name?: string;
  level?: number;
};

const methods = ["create", "update", "delete", "getAll", "getById"] as const;

export type TierHandlers = {
  create: (_: any, dto: CreateTierDto) => Promise<Tier>;
  update: (_: any, id: number, dto: UpdateTierDto) => Promise<Tier>;
  delete: (_: any, id: number) => Promise<void>;
  getAll: (_: any) => Promise<Tier[]>;
  getById: (_: any, id: number) => Promise<Tier>;
};

export const namespace = "tier" as const;
export const tierMethods = methods.map((m) => prefixNamespace(namespace, m));
export type TierIpcChannel = keyof PrefixNamespace<TierHandlers, typeof namespace>;
export type TierIpcHandlers = {
  [K in TierIpcChannel]: TierHandlers[StripNamespace<K, typeof namespace>];
};
