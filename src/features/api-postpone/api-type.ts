import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";

export type PostponeBlueskyDraftPayload = {
  postId: string;
};

export type PostponeBlueskyDraftResponse = {
  success: boolean;
};

const methods = ["draftBlueskyPost"] as const;

export type APIPostponeHandlers = {
  draftBlueskyPost: (
    _: any,
    data: PostponeBlueskyDraftPayload
  ) => Promise<PostponeBlueskyDraftResponse>;
};

export const namespace = "api-postpone" as const;
export const apiPostponeMethods = methods.map((m) => prefixNamespace(namespace, m));
export type APIPostponeIpcChannel = keyof PrefixNamespace<APIPostponeHandlers, typeof namespace>;
export type APIPostponeIpcHandlers = {
  [K in APIPostponeIpcChannel]: APIPostponeHandlers[StripNamespace<K, typeof namespace>];
};
