import { resetCategoriesDatabase } from "./categories/base";
import { resetChannelsDatabase } from "./channels/base";
import { resetContentSchedulesDatabase } from "./content-schedules/base";
import { resetMediaDatabase } from "./media/base";
import { resetPostsDatabase } from "./posts/base";

export const resetAllDatabases = async () => {
  console.log("🗑️ Starting full database reset...");
  try {
    await Promise.all([
      resetCategoriesDatabase(),
      resetChannelsDatabase(),
      resetContentSchedulesDatabase(),
      resetMediaDatabase(),
      resetPostsDatabase(),
    ]);
    console.log("✅ All databases reset successfully");
  } catch (error) {
    console.error("❌ Error during database reset:", error);
    throw error;
  }
};
