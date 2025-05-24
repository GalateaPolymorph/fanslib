import { AppDataSource } from "../../lib/db";
import { FanslyAnalyticsResponse } from "../../lib/fansly-analytics/fansly-analytics-response";
import { Post } from "../posts/entity";
import { loadFanslyCredentials } from "../settings/secure-storage";
import { addDatapointsToPost } from "./operations";

// Fansly API constants
const FANSLY_API_URL = "https://apiv3.fansly.com/api/v1/it/moie/statsnew";

/**
 * Fetches analytics data for a Fansly post using the statistics ID
 */
export const fetchFanslyAnalyticsData = async (
  postId: string
): Promise<FanslyAnalyticsResponse> => {
  // Get the post from the database
  const postRepository = AppDataSource.getRepository(Post);
  const post = await postRepository.findOneOrFail({
    where: { id: postId },
  });

  // Ensure we have a valid statistics ID
  if (!post.fanslyStatisticsId) {
    throw new Error("Post does not have a valid Fansly statistics ID");
  }

  // Load Fansly credentials from secure storage
  const credentials = await loadFanslyCredentials();

  if (!credentials.fanslyAuth || !credentials.fanslySessionId) {
    throw new Error(
      "Fansly credentials not configured. Please set up your Fansly authentication in settings."
    );
  }

  // Calculate dates for the last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30);

  // Convert to timestamps (milliseconds)
  const beforeDate = endDate.getTime();
  const afterDate = startDate.getTime();
  const period = 86400000; // 24 hours in milliseconds

  // Create the URL with the proper parameters
  const url = new URL(FANSLY_API_URL);
  url.searchParams.append("mediaOfferId", post.fanslyStatisticsId);
  url.searchParams.append("beforeDate", beforeDate.toString());
  url.searchParams.append("afterDate", afterDate.toString());
  url.searchParams.append("period", period.toString());
  url.searchParams.append("ngsw-bypass", "true");

  // Build headers with stored credentials
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    authorization: credentials.fanslyAuth,
    "fansly-client-check": credentials.fanslyClientCheck || "159208de0e5574",
    "fansly-client-id": credentials.fanslyClientId || "715651835356000256",
    "fansly-session-id": credentials.fanslySessionId,
    "fansly-client-ts": Date.now().toString(),
    priority: "u=1, i",
    "sec-ch-ua": '"Chromium";v="135", "Not-A.Brand";v="8"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
  };

  try {
    // Make the request to the Fansly API
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      referrer: "https://fansly.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Fansly authentication failed. Please update your credentials in settings."
        );
      }
      throw new Error(`Fansly API returned ${response.status}: ${response.statusText}`);
    }

    const data: FanslyAnalyticsResponse = await response.json();

    // Store the analytics data using the existing addDatapointsToPost function
    await addDatapointsToPost(postId, data);

    return data;
  } catch (error) {
    console.error("Error fetching Fansly analytics:", error);
    throw error;
  }
};
