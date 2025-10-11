import { generateInsights } from "./operations";
import { getFanslyPostsWithAnalytics } from "../post-analytics/operations";
import { InsightsHandlers } from "./api-type";

export const insightsHandlers: InsightsHandlers = {
  generateInsights: async (_: unknown) => {
    const posts = await getFanslyPostsWithAnalytics();
    return generateInsights(posts);
  },
};
