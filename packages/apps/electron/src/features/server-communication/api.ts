import { prefixNamespaceObject } from "../../lib/namespace";
import {
  checkServerAvailability,
  createQueueJob,
  getQueueJob,
  getQueueJobs,
  getQueueStatus,
  isServerAvailable,
  schedulePostsToServer,
} from "./api-client";
import { namespace, ServerCommunicationHandlers } from "./api-type";
import { getServerJobs, removeServerJob, syncStatusFromServer } from "./queue-sync";
import { syncCompletedJobs } from "./post-sync";
import {
  clearServerSession,
  getServerSessionStatus,
  storeSessionToServer,
  syncSessionWithServer,
} from "./session-manager";

export const handlers: ServerCommunicationHandlers = {
  createJob: (_, jobData) => createQueueJob(jobData),
  getJobs: (_, since) => getQueueJobs(since),
  getJobById: (_, id) => getQueueJob(id),
  deleteJob: (_, id) => removeServerJob(id),
  getStatus: (_, since) => getQueueStatus(since),
  sync: (_) => syncStatusFromServer(),
  isServerAvailable: (_) => isServerAvailable(),
  getServerJobs: (_) => getServerJobs(),
  transferSession: (_, { sessionData, username }) => storeSessionToServer(sessionData, username),
  getSessionStatus: (_, username) => getServerSessionStatus(username),
  clearSession: (_, username) => clearServerSession(username),
  syncSession: (_, username) => syncSessionWithServer(username),
  schedulePostsToServer: (_, posts) => schedulePostsToServer(posts),
  checkServerAvailability: (_) => checkServerAvailability(),
  syncCompletedJobs: (_) => syncCompletedJobs(),
};

export const serverCommunicationHandlers = prefixNamespaceObject(namespace, handlers);
