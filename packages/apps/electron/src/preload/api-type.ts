import { ElectronAPI } from "@electron-toolkit/preload";
import { IpcChannel, IpcHandlers } from "../features/index-renderer";
import { Tail } from "../lib/tail";

export {};

type AppAPI = {
  [K in IpcChannel]: (...args: Tail<Parameters<IpcHandlers[K]>>) => ReturnType<IpcHandlers[K]>;
};

declare global {
  interface Window {
    electron: ElectronAPI;
    api: AppAPI;
  }
}
