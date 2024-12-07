import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { IpcHandlers, ipcMethods } from "../features/index-renderer";
import { stripNamespace } from "../lib/namespace";
import { Tail } from "../lib/tail";

const appApi = () =>
  Object.fromEntries(
    ipcMethods.map((channel) => [
      channel,
      async (...args: Tail<Parameters<IpcHandlers[typeof channel]>>) => {
        const handlerName = stripNamespace(channel);
        if (handlerName.startsWith("on")) {
          // @ts-expect-error
          return ipcRenderer.on(channel, ...args);
        }
        if (handlerName.startsWith("off")) {
          // @ts-expect-error
          return ipcRenderer.removeListener(channel, ...args);
        }

        return ipcRenderer.invoke(channel, ...args);
      },
    ])
  ) as unknown as {
    [K in keyof IpcHandlers]: (
      ...args: Tail<Parameters<IpcHandlers[K]>>
    ) => ReturnType<IpcHandlers[K]>;
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
