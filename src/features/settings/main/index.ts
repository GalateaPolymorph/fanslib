import { registerLoadHandler } from "./load";
import { registerSaveHandler } from "./save";
export type { Settings } from "./types";

export const registerSettingsHandlers = () => {
  registerLoadHandler();
  registerSaveHandler();
};
