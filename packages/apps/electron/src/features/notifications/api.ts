import { BrowserWindow } from "electron";
import { prefixNamespaceObject } from "../../lib/namespace";
import { NotificationHandlers, NotificationPayload, namespace } from "./api-type";

const handlers: NotificationHandlers = {
  onNotify: (_) => {},
  // Stub
};

export const notificationHandlers = prefixNamespaceObject(namespace, handlers);

export const sendNotification = (notification: NotificationPayload) => {
  if (BrowserWindow.getAllWindows().length <= 0) return;
  const win = BrowserWindow.getAllWindows()[0];
  console.log("Sending notification", notification);
  win.webContents.send("notification:notify", notification);
};
