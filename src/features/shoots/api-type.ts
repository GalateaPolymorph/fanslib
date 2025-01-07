import { prefixNamespace, StripNamespace } from "../../lib/namespace";
import { PaginatedResponse, PaginationParams } from "../_common/pagination";
import { Media } from "../library/entity";
import { Shoot } from "./entity";

export type CreateShootPayload = {
  name: string;
  description?: string;
  shootDate: Date;
  mediaIds: string[];
};

export type UpdateShootPayload = Partial<CreateShootPayload>;

export type GetAllShootsParams = Partial<PaginationParams> & {
  search?: string;
  startDate?: Date;
  endDate?: Date;
};

export type ShootWithMedia = Shoot & {
  media: Media[];
};

export type ShootSummary = ShootWithMedia & {
  mediaCount: number;
};

const methods = ["create", "get", "getAll", "update", "delete"] as const;

export type ShootHandlers = {
  create: (_: unknown, payload: CreateShootPayload) => Promise<ShootWithMedia>;
  get: (_: unknown, id: string) => Promise<ShootWithMedia | null>;
  getAll: (_: unknown, params?: GetAllShootsParams) => Promise<PaginatedResponse<ShootSummary>>;
  update: (_: unknown, id: string, payload: UpdateShootPayload) => Promise<ShootWithMedia>;
  delete: (_: unknown, id: string) => Promise<void>;
};

export const namespace = "shoot" as const;
export const shootMethods = methods.map((m) => prefixNamespace(namespace, m));

export type ShootIpcChannel = (typeof shootMethods)[number];
export type ShootIpcHandlers = {
  [K in ShootIpcChannel]: ShootHandlers[StripNamespace<K, typeof namespace>];
};
