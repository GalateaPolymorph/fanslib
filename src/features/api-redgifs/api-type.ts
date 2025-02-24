import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";

export type RedGIFsPostPayload = {
  postId: string;
};

export type RedGIFsPostResponse = {
  url: string;
};

const methods = ["post"] as const;

export type APIRedGIFsHandlers = {
  post: (_: any, data: RedGIFsPostPayload) => Promise<RedGIFsPostResponse>;
};

export const namespace = "api-redgifs" as const;
export const apiRedGIFsMethods = methods.map((m) => prefixNamespace(namespace, m));
export type APIRedGIFsIpcChannel = keyof PrefixNamespace<APIRedGIFsHandlers, typeof namespace>;
export type APIRedGIFsIpcHandlers = {
  [K in APIRedGIFsIpcChannel]: APIRedGIFsHandlers[StripNamespace<K, typeof namespace>];
};
