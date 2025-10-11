import { prefixNamespace, PrefixNamespace, StripNamespace } from "../../lib/namespace";
import type { GeneratedPost } from "../reddit-poster/api-type";
import type {
  CreateQueueJobRequest,
  QueueJobResponse,
  QueueListResponse,
  SessionResponse,
} from "./types";

export const methods = [
  "createJob",
  "getJobs",
  "getJobById",
  "deleteJob",
  "getStatus",
  "sync",
  "isServerAvailable",
  "getServerJobs",
  "transferSession",
  "getSessionStatus",
  "clearSession",
  "syncSession",
  "schedulePostsToServer",
  "checkServerAvailability",
  "syncCompletedJobs",
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
  transferSession: (
    _: any,
    params: { sessionData: any; username?: string }
  ) => Promise<SessionResponse | null>;
  getSessionStatus: (
    _: any,
    username?: string
  ) => Promise<{
    hasSession: boolean;
    isValid: boolean;
    session?: SessionResponse;
  }>;
  clearSession: (_: any, username?: string) => Promise<boolean>;
  syncSession: (_: any, username?: string) => Promise<boolean>;
  schedulePostsToServer: (_: any, posts: GeneratedPost[]) => Promise<QueueJobResponse[]>;
  checkServerAvailability: (_: any) => Promise<boolean>;
  syncCompletedJobs: (_: any) => Promise<number>; // Returns number of posts created
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
