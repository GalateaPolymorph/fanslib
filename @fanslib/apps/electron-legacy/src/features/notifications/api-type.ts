import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";

export type NotificationPayload = {
  title: string;
  body: string;
};

const methods = ["onNotify"] as const;
export type NotificationHandlers = {
  onNotify: (_: any, listener: (_: any, notification: NotificationPayload) => void) => void;
};

export const namespace = "notification" as const;
export const notificationMethods = methods.map((m) => prefixNamespace(namespace, m));
export type NotificationIpcChannel = keyof PrefixNamespace<NotificationHandlers, typeof namespace>;
export type NotificationIpcHandlers = {
  [K in NotificationIpcChannel]: NotificationHandlers[StripNamespace<K, typeof namespace>];
};
