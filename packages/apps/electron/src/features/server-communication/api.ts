import { prefixNamespaceObject } from "../../lib/namespace";
import { namespace, ServerCommunicationHandlers } from "./api-type";
import {
  createQueueJob,
  getQueueJobs,
  getQueueJob,
  deleteQueueJob,
  getQueueStatus,
  isServerAvailable,
} from "./api-client";
import { syncStatusFromServer, getServerJobs } from "./queue-sync";
import {
  transferElectronSessionToServer,
  getServerSessionStatus,
  clearServerSession,
  syncSessionWithServer,
} from "./session-manager";

export const handlers: ServerCommunicationHandlers = {
  createJob: (_, jobData) => createQueueJob(jobData),
  getJobs: (_, since) => getQueueJobs(since),
  getJobById: (_, id) => getQueueJob(id),
  deleteJob: (_, id) => deleteQueueJob(id),
  getStatus: (_, since) => getQueueStatus(since),
  sync: (_) => syncStatusFromServer(),
  isServerAvailable: (_) => isServerAvailable(),
  getServerJobs: (_) => getServerJobs(),
  transferSession: (_, username) => transferElectronSessionToServer(username),
  getSessionStatus: (_, username) => getServerSessionStatus(username),
  clearSession: (_, username) => clearServerSession(username),
  syncSession: (_, username) => syncSessionWithServer(username),
};

export const serverCommunicationHandlers = prefixNamespaceObject(namespace, handlers);
