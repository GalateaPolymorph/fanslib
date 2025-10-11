import { ipcMain, IpcMainInvokeEvent } from "electron";
import { handlers } from "../features/index-main";

type Handler = (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any> | any;
export class IpcRegistry {
  private registeredHandlers: Map<string, Handler> = new Map();

  registerAll(): void {
    Object.entries(handlers).forEach(([channel, handler]) => {
      this.registeredHandlers.set(channel, handler);
      ipcMain.handle(channel, handler);
    });
  }

  unregisterAll(): void {
    this.registeredHandlers.forEach((_, channel) => {
      ipcMain.removeHandler(channel);
    });
    this.registeredHandlers.clear();
  }
}
