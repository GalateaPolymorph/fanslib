import { analyticsHandlers } from "./analytics/api";
import { apiPostponeHandlers } from "./api-postpone/api";
import { channelHandlers } from "./channels/api";
import { contentScheduleHandlers } from "./content-schedules/api";
import { filterPresetHandlers } from "./filter-presets/api";
import { hashtagHandlers } from "./hashtags/api";
import { libraryHandlers } from "./library/api";
import { notificationHandlers } from "./notifications/api";
import { osHandlers } from "./os/api";
import { postHandlers } from "./posts/api";
import { settingsHandlers } from "./settings/api";
import { shootHandlers } from "./shoots/api";
import { snippetHandlers } from "./snippets/api";
import { tagHandlers } from "./tags/api";
import { automationHandlers } from "./automation/api";
export * from "./index-renderer";

export const handlers = {
  ...channelHandlers,
  ...contentScheduleHandlers,
  ...filterPresetHandlers,
  ...libraryHandlers,
  ...notificationHandlers,
  ...osHandlers,
  ...postHandlers,
  ...shootHandlers,
  ...settingsHandlers,
  ...hashtagHandlers,
  ...apiPostponeHandlers,
  ...analyticsHandlers,
  ...tagHandlers,
  ...snippetHandlers,
  ...automationHandlers,
};
