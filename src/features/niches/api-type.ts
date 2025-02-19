import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import { Niche } from "./entity";

export type CreateNicheDto = {
  name: string;
  hashtags?: string[];
};

export type UpdateNicheDto = {
  name?: string;
  hashtags?: string[];
};

const methods = ["create", "update", "delete", "getAll", "getById"] as const;

export type NicheHandlers = {
  create: (_: any, dto: CreateNicheDto) => Promise<Niche>;
  update: (_: any, id: number, dto: UpdateNicheDto) => Promise<Niche>;
  delete: (_: any, id: number) => Promise<void>;
  getAll: (_: any) => Promise<Niche[]>;
  getById: (_: any, id: number) => Promise<Niche>;
};

export const namespace = "niche" as const;
export const nicheMethods = methods.map((m) => prefixNamespace(namespace, m));
export type NicheIpcChannel = keyof PrefixNamespace<NicheHandlers, typeof namespace>;
export type NicheIpcHandlers = {
  [K in NicheIpcChannel]: NicheHandlers[StripNamespace<K, typeof namespace>];
};
