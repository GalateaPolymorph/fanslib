import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { IpcHandlers, ipcMethods } from "../features/index-renderer";
import { onlyNamespace, stripNamespace } from "../lib/namespace";
import { Tail } from "../lib/tail";

// e.g. library:onChanged -> library:changed
const channelToEventName = (channel: string) => {
  const handlerName = stripNamespace(channel);
  if (!handlerName.startsWith("on") && !handlerName.startsWith("off")) {
    return channel;
  }
  const eventName = handlerName.replace("on", "").replace("off", "").toLowerCase();
  const namespace = onlyNamespace(channel);
  return `${namespace}:${eventName}`;
};

const appApi = () => {
  const listeners = Object.fromEntries(
    ipcMethods.map((channel) => [
      channel,
      async (...args: Tail<Parameters<IpcHandlers[typeof channel]>>) => {
        const handlerName = stripNamespace(channel);
        if (handlerName.startsWith("on")) {
          // @ts-expect-error
          return ipcRenderer.on(channelToEventName(channel), ...args);
        }
        if (handlerName.startsWith("off")) {
          // @ts-expect-error
          return ipcRenderer.removeListener(channelToEventName(channel), ...args);
        }

        return ipcRenderer.invoke(channel, ...args);
      },
    ])
  ) as unknown as {
    [K in keyof IpcHandlers]: (
      ...args: Tail<Parameters<IpcHandlers[K]>>
    ) => ReturnType<IpcHandlers[K]>;
  };

  return listeners;
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = appApi();
}

contextBridge.exposeInMainWorld("api", appApi());
