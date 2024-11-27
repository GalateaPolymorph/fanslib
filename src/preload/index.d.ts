import { ElectronAPI } from "@electron-toolkit/preload";
import { AppAPI } from "./bridge";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: AppAPI;
  }
}
