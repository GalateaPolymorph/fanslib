import { FanslyAnalyticsResponse } from "./fansly-analytics-response";

export const parseAnalyticsResponse = (jsonString: string): FanslyAnalyticsResponse | null => {
  try {
    const data = JSON.parse(jsonString) as FanslyAnalyticsResponse;
    if (!data.success || !data.response?.dataset) {
      return null;
    }
    return data;
  } catch (error) {
    console.error("Failed to parse analytics response:", error);
    return null;
  }
};
