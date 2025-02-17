import { categoryHandlers } from "./categories/api";
import { channelHandlers } from "./channels/api";
import { contentScheduleHandlers } from "./content-schedules/api";
import { libraryHandlers } from "./library/api";
import { notificationHandlers } from "./notifications/api";
import { osHandlers } from "./os/api";
import { postHandlers } from "./posts/api";
import { settingsHandlers } from "./settings/api";
import { shootHandlers } from "./shoots/api";
import { tagHandlers } from "./tags/api";
import { tierHandlers } from "./tiers/api";

export * from "./index-renderer";

export const handlers = {
  ...categoryHandlers,
  ...channelHandlers,
  ...contentScheduleHandlers,
  ...libraryHandlers,
  ...notificationHandlers,
  ...osHandlers,
  ...postHandlers,
  ...shootHandlers,
  ...settingsHandlers,
  ...tagHandlers,
  ...tierHandlers,
};
