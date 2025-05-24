import { BrowserWindow } from "electron";
import { db } from "../../lib/db";
import { Post } from "../posts/entity";
import { AnalyticsFetchHistory } from "./entity";
import { fetchFanslyAnalyticsData } from "./fetch-fansly-data";
import { classifyTimeframe, isFetchExpired } from "./timeframe-utils";

export type BulkFetchProgress = {
  current: number;
  total: number;
  currentPost?: {
    id: string;
    caption: string;
  };
};

export type BulkFetchResult = {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
  errors: Array<{
    postId: string;
    caption: string;
    error: string;
  }>;
};

/**
 * Check if analytics data should be fetched for a post and timeframe based on TTL system
 * Uses AnalyticsFetchHistory to track when data was last fetched and if it has expired
 */
const shouldFetchAnalytics = async (
  postId: string,
  analyticsStartDate: Date,
  analyticsEndDate: Date
): Promise<boolean> => {
  console.log(
    `Checking if analytics should be fetched for post ${postId} from ${analyticsStartDate.toISOString()} to ${analyticsEndDate.toISOString()}`
  );

  const timeframeClassification = classifyTimeframe(analyticsStartDate, analyticsEndDate);
  console.log(`Timeframe classification:`, timeframeClassification);

  const dataSource = await db();
  const fetchHistoryRepository = dataSource.getRepository(AnalyticsFetchHistory);

  // Check if we have a fetch record for this post and timeframe
  const existingFetch = await fetchHistoryRepository.findOne({
    where: {
      postId,
      timeframeIdentifier: timeframeClassification.identifier,
    },
    order: { fetchedAt: "DESC" }, // Get the most recent fetch
  });

  if (!existingFetch) {
    console.log(`No fetch history found - should fetch`);
    return true;
  }

  // Check if the fetch has expired (only relevant for rolling timeframes)
  const hasExpired = isFetchExpired(existingFetch.expiresAt);

  if (hasExpired) {
    console.log(
      `Fetch history expired (fetched at ${existingFetch.fetchedAt.toISOString()}, expired at ${existingFetch.expiresAt?.toISOString()}) - should fetch`
    );
    return true;
  }

  console.log(
    `Recent fetch found (fetched at ${existingFetch.fetchedAt.toISOString()}) - no need to fetch`
  );
  return false;
};

/**
 * Record that analytics data was fetched for a post and timeframe
 */
const recordAnalyticsFetch = async (
  postId: string,
  analyticsStartDate: Date,
  analyticsEndDate: Date
): Promise<void> => {
  const timeframeClassification = classifyTimeframe(analyticsStartDate, analyticsEndDate);
  const dataSource = await db();
  const fetchHistoryRepository = dataSource.getRepository(AnalyticsFetchHistory);

  const now = new Date();
  const expiresAt = timeframeClassification.ttlHours
    ? new Date(now.getTime() + timeframeClassification.ttlHours * 60 * 60 * 1000)
    : undefined;

  const fetchRecord = fetchHistoryRepository.create({
    postId,
    timeframeIdentifier: timeframeClassification.identifier,
    timeframeType: timeframeClassification.type,
    fetchedAt: now,
    expiresAt,
  });

  await fetchHistoryRepository.save(fetchRecord);
  console.log(
    `Recorded fetch for ${timeframeClassification.identifier}, expires: ${expiresAt?.toISOString() || "never"}`
  );
};

class BulkAnalyticsFetcher {
  private static instance: BulkAnalyticsFetcher;
  private isCurrentlyFetching = false;

  public static getInstance(): BulkAnalyticsFetcher {
    if (!BulkAnalyticsFetcher.instance) {
      BulkAnalyticsFetcher.instance = new BulkAnalyticsFetcher();
    }
    return BulkAnalyticsFetcher.instance;
  }

  public isCurrentlyRunning(): boolean {
    return this.isCurrentlyFetching;
  }

  public onProgress(progress: BulkFetchProgress): void {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length <= 0) {
      return;
    }
    const win = windows[0];
    win.webContents.send("analytics:bulkfetchprogress", progress);
  }

  public onComplete(result: BulkFetchResult): void {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length <= 0) {
      return;
    }
    const win = windows[0];
    win.webContents.send("analytics:bulkfetchcomplete", result);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getRandomDelay(): number {
    return Math.floor(Math.random() * 2000) + 1000;
  }

  public async startBulkFetch(analyticsStartDate?: Date, analyticsEndDate?: Date): Promise<void> {
    if (this.isCurrentlyFetching) {
      throw new Error("Bulk fetch already in progress");
    }

    this.isCurrentlyFetching = true;

    try {
      // Use default timeframe if not provided
      const fetchEndDate = analyticsEndDate || new Date();
      const fetchStartDate =
        analyticsStartDate ||
        (() => {
          const date = new Date();
          date.setDate(date.getDate() - 30);
          return date;
        })();

      const dataSource = await db();
      const postRepository = dataSource.getRepository(Post);

      // Get posts that are currently displayed (have analytics data and are Fansly posts)
      const allPosts = await postRepository
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.channel", "channel")
        .leftJoinAndSelect("post.fanslyAnalyticsAggregate", "analytics")
        .where("channel.typeId = :typeId", { typeId: "fansly" })
        .andWhere("post.fanslyStatisticsId IS NOT NULL")
        .andWhere("analytics.id IS NOT NULL") // Only posts that are currently displayed (have analytics)
        .orderBy("post.date", "DESC")
        .getMany();

      // Filter posts to only include those missing analytics data for the timeframe
      const postsNeedingData: Post[] = [];

      console.log(`Checking ${allPosts.length} posts for missing analytics data in timeframe:`, {
        startDate: fetchStartDate.toISOString(),
        endDate: fetchEndDate.toISOString(),
      });

      for (const post of allPosts) {
        const shouldFetch = await shouldFetchAnalytics(post.id, fetchStartDate, fetchEndDate);

        console.log(
          `Post "${post.caption?.slice(0, 50)}..." (${post.id}): shouldFetch = ${shouldFetch}`
        );

        if (shouldFetch) {
          postsNeedingData.push(post);
          console.log(`Added post to fetch queue: ${post.caption?.slice(0, 50)}...`);
        } else {
          console.log(`Skipped post (recently fetched): ${post.caption?.slice(0, 50)}...`);
        }
      }

      console.log(
        `Found ${postsNeedingData.length} posts needing data out of ${allPosts.length} total posts`
      );

      const result: BulkFetchResult = {
        total: postsNeedingData.length,
        successful: 0,
        failed: 0,
        skipped: allPosts.length - postsNeedingData.length,
        errors: [],
      };

      const postsToProcess = postsNeedingData.map((post) => ({
        id: post.id,
        caption: post.caption || "(No caption)",
      }));

      for (let i = 0; i < postsToProcess.length; i++) {
        const post = postsToProcess[i];

        // Send progress update
        this.onProgress({
          current: i + 1,
          total: postsToProcess.length,
          currentPost: post,
        });

        try {
          // Pass analytics timeframe to fetchFanslyAnalyticsData
          console.log(
            `Fetching analytics data for post ${post.id} (${post.caption?.slice(0, 50)}...) for timeframe ${fetchStartDate.toISOString()} to ${fetchEndDate.toISOString()}`
          );

          const analyticsData = await fetchFanslyAnalyticsData(
            post.id,
            fetchStartDate,
            fetchEndDate
          );

          console.log(`Successfully fetched analytics data for post ${post.id}:`, {
            datapoints: analyticsData?.response?.dataset?.datapoints?.length || 0,
            period: analyticsData?.response?.dataset?.period,
            dateAfter: analyticsData?.response?.dataset?.dateAfter,
            dateBefore: analyticsData?.response?.dataset?.dateBefore,
          });

          // Record the successful fetch in history
          await recordAnalyticsFetch(post.id, fetchStartDate, fetchEndDate);

          result.successful++;
        } catch (error) {
          console.error(
            `Failed to fetch analytics for post ${post.id} (${post.caption?.slice(0, 50)}...):`,
            error
          );
          result.failed++;
          result.errors.push({
            postId: post.id,
            caption: post.caption,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }

        // Add delay between requests, but not after the last one
        if (i < postsToProcess.length - 1) {
          const delay = this.getRandomDelay();
          await this.sleep(delay);
        }
      }

      this.onComplete(result);
    } finally {
      this.isCurrentlyFetching = false;
    }
  }
}

export const bulkFetchAnalytics = async (params?: {
  startDate: string;
  endDate: string;
}): Promise<BulkFetchResult> => {
  const fetcher = BulkAnalyticsFetcher.getInstance();

  // Convert string dates to Date objects if provided (these are analytics timeframe, not post selection)
  const analyticsStartDate = params?.startDate ? new Date(params.startDate) : undefined;
  const analyticsEndDate = params?.endDate ? new Date(params.endDate) : undefined;

  // Start the fetch process asynchronously
  fetcher.startBulkFetch(analyticsStartDate, analyticsEndDate).catch((error) => {
    console.error("Bulk analytics fetch failed:", error);
  });

  // Return immediately with empty result - frontend will be notified of progress via events
  return {
    total: 0,
    successful: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };
};

export { BulkAnalyticsFetcher };
