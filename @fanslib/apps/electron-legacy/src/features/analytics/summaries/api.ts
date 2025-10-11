import { getAnalyticsSummary } from "./operations";
import { AnalyticsSummaryParams, SummariesHandlers } from "./api-type";

export const summariesHandlers: SummariesHandlers = {
  getAnalyticsSummary: async (_: unknown, params?: AnalyticsSummaryParams) => {
    if (!params) {
      // Default to last 30 days if no parameters provided
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      return getAnalyticsSummary(startDate, endDate);
    }

    // Convert date strings to Date objects
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    return getAnalyticsSummary(startDate, endDate);
  },
};
