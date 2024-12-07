import { categoryHandlers } from "./categories/api";
import { channelHandlers } from "./channels/api";
import { contentScheduleHandlers } from "./content-schedules/api";
import { libraryHandlers } from "./library/api";
import { osHandlers } from "./os/api";
import { postHandlers } from "./posts/api";
import { settingsHandlers } from "./settings/api";

export * from "./index-renderer";

export const handlers = {
  ...categoryHandlers,
  ...channelHandlers,
  ...contentScheduleHandlers,
  ...libraryHandlers,
  ...osHandlers,
  ...postHandlers,
  ...settingsHandlers,
};
