import { loadChannelTypeFixtures } from "../features/channels/fixtures";
import { loadMediaFixtures } from "./media";
import { loadSettingsFixtures } from "./settings";

export const loadAllFixtures = async () => {
  console.log("📦 Loading development fixtures...");

  try {
    await loadSettingsFixtures();
    // Load fixtures in dependency order
    await loadChannelTypeFixtures();
    // await loadTagFixtures();
    // await loadChannelFixtures();
    // await loadSubredditFixtures();
    // await loadHashtagFixtures();
    // await loadShootFixtures();
    await loadMediaFixtures();
    // await loadPostFixtures();
    // await loadContentScheduleFixtures();
    // await loadAnalyticsFixtures();
    // await loadSnippetFixtures();

    console.log("✅ Development fixtures loaded successfully");
  } catch (error) {
    console.error("❌ Error loading fixtures:", error);
    throw error;
  }
};
