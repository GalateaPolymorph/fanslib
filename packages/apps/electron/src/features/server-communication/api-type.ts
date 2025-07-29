import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import type { QueueJobResponse, CreateQueueJobRequest, QueueListResponse } from "./types";

export const methods = [
  "createJob",
  "getJobs",
  "getJobById",
  "deleteJob",
  "getStatus",
  "sync",
  "isServerAvailable",
  "getServerJobs",
] as const;

export type ServerCommunicationHandlers = {
  createJob: (_: any, jobData: CreateQueueJobRequest) => Promise<QueueJobResponse>;
  getJobs: (_: any, since?: string) => Promise<QueueListResponse>;
  getJobById: (_: any, id: string) => Promise<QueueJobResponse>;
  deleteJob: (_: any, id: string) => Promise<void>;
  getStatus: (_: any, since?: string) => Promise<QueueListResponse>;
  sync: (_: any) => Promise<void>;
  isServerAvailable: (_: any) => Promise<boolean>;
  getServerJobs: (_: any) => QueueJobResponse[];
};

export const namespace = "server-communication" as const;
export const serverCommunicationMethods = methods.map((m) => prefixNamespace(namespace, m));
export type ServerCommunicationIpcChannel = keyof PrefixNamespace<
  ServerCommunicationHandlers,
  typeof namespace
>;
export type ServerCommunicationIpcHandlers = {
  [K in ServerCommunicationIpcChannel]: ServerCommunicationHandlers[StripNamespace<
    K,
    typeof namespace
  >];
};
