import type { Page } from "playwright";
import type { FanslyPostData, PostDiscoveryOptions } from "./context";
import {
  LOAD_MORE_BUTTON_SELECTOR,
  LOADING_SPINNER_SELECTOR,
  POST_ITEM_SELECTOR,
  POST_LINK_SELECTOR,
  POST_MENU_SELECTOR,
  STATISTICS_LINK_SELECTOR,
  TIMELINE_SELECTOR,
  VIEW_ANALYTICS_OPTION_SELECTOR,
} from "./selectors";

export const navigateToProfile = async (page: Page): Promise<void> => {
  console.log("[Fansly Automation] Navigating to profile");

  const avatar = page.locator(".user-account.sm-mobile-hidden > .avatar-container").first();
  await avatar.waitFor({ timeout: 10000 });
  await avatar.click();

  const profileLink = page
    .locator("div")
    .filter({ hasText: /^Profile$/ })
    .first();
  await profileLink.waitFor({ timeout: 10000 });
  await profileLink.click();

  console.log("[Fansly Automation] Arrived at profile page");
  await page.waitForSelector(TIMELINE_SELECTOR, { timeout: 10000 });
};

export const extractPostId = (postUrl: string): string | null => {
  // Extract post ID from URLs like "https://fansly.com/post/123456789"
  const match = postUrl.match(/\/post\/(\d+)/);
  return match ? match[1] : null;
};

export const extractStatisticsId = (statisticsUrl: string): string | null => {
  // Extract statistics ID from URLs like "https://fansly.com/statistics/123456789012345678"
  const match = statisticsUrl.match(/\/statistics\/(\d+)/);
  return match ? match[1] : null;
};

export const discoverPostsOnCurrentPage = async (page: Page): Promise<FanslyPostData[]> => {
  const posts: FanslyPostData[] = [];

  // Wait for posts to load
  await page.waitForSelector(TIMELINE_SELECTOR, { timeout: 10000 });

  // Get all post items on the current page
  const postElements = await page.$$(POST_ITEM_SELECTOR);
  console.log("Found", postElements.length, "posts on the current page");
  await page.pause();

  for (const postElement of postElements) {
    try {
      // Get post link
      const postLinkElement = await postElement.$(POST_LINK_SELECTOR);
      if (!postLinkElement) continue;

      const postUrl = await postLinkElement.getAttribute("href");
      if (!postUrl) continue;

      const postId = extractPostId(postUrl);
      if (!postId) continue;

      // Try to find statistics link directly
      let statisticsUrl: string | null = null;
      let statisticsId: string | null = null;

      // Method 1: Look for direct statistics link
      const directStatsLink = await postElement.$(STATISTICS_LINK_SELECTOR);
      if (directStatsLink) {
        statisticsUrl = await directStatsLink.getAttribute("href");
        if (statisticsUrl) {
          statisticsId = extractStatisticsId(statisticsUrl);
        }
      }

      // Method 2: If no direct link, try to open post menu and find analytics option
      if (!statisticsUrl) {
        try {
          const menuButton = await postElement.$(POST_MENU_SELECTOR);
          if (menuButton) {
            await menuButton.click();
            await page.waitForTimeout(500);

            const analyticsOption = await page.$(VIEW_ANALYTICS_OPTION_SELECTOR);
            if (analyticsOption) {
              statisticsUrl = await analyticsOption.getAttribute("href");
              if (statisticsUrl) {
                statisticsId = extractStatisticsId(statisticsUrl);
              }
            }

            // Close menu by clicking elsewhere
            await page.keyboard.press("Escape");
            await page.waitForTimeout(300);
          }
        } catch (error) {
          console.warn("[Fansly Automation] Could not access post menu:", error);
        }
      }

      // Get additional post metadata if available
      let title: string | undefined;
      let thumbnailUrl: string | undefined;

      try {
        // Try to extract title from post element
        const titleElement = await postElement.$('[data-testid="post-title"]');
        if (titleElement) {
          title = await titleElement.textContent();
        }

        // Try to extract thumbnail
        const thumbnailElement = await postElement.$("img");
        if (thumbnailElement) {
          thumbnailUrl = await thumbnailElement.getAttribute("src");
        }
      } catch {
        // Metadata extraction is optional
      }

      // Only add posts that have both post ID and statistics ID
      if (postId && statisticsId && statisticsUrl) {
        posts.push({
          postId,
          postUrl: `https://fansly.com${postUrl}`,
          statisticsId,
          statisticsUrl: `https://fansly.com${statisticsUrl}`,
          title,
          thumbnailUrl,
        });

        console.log(`[Fansly Automation] Found post with statistics: ${postId}`);
      } else {
        console.warn(`[Fansly Automation] Post ${postId} missing statistics ID`);
      }
    } catch (error) {
      console.warn("[Fansly Automation] Error processing post element:", error);
    }
  }

  return posts;
};

export const loadMorePosts = async (page: Page): Promise<boolean> => {
  try {
    // Check if "Load More" button exists and is visible
    const loadMoreButton = await page.$(LOAD_MORE_BUTTON_SELECTOR);
    if (!loadMoreButton) return false;

    const isVisible = await loadMoreButton.isVisible();
    if (!isVisible) return false;

    // Click load more button
    await loadMoreButton.click();

    // Wait for loading to complete
    try {
      await page.waitForSelector(LOADING_SPINNER_SELECTOR, { timeout: 2000 });
      await page.waitForSelector(LOADING_SPINNER_SELECTOR, {
        state: "hidden",
        timeout: 10000,
      });
    } catch {
      // Loading spinner might not appear or might finish quickly
      await page.waitForTimeout(2000);
    }

    return true;
  } catch (error) {
    console.warn("[Fansly Automation] Error loading more posts:", error);
    return false;
  }
};

export const discoverAllPosts = async (
  page: Page,
  options: PostDiscoveryOptions = {}
): Promise<FanslyPostData[]> => {
  const { maxPosts = 100, daysBack = 30 } = options;
  const allPosts: FanslyPostData[] = [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);

  console.log(
    `[Fansly Automation] Starting post discovery (max: ${maxPosts}, days back: ${daysBack})`
  );

  let page_number = 1;
  let hasMorePages = true;

  while (hasMorePages && allPosts.length < maxPosts) {
    console.log(`[Fansly Automation] Discovering posts on page ${page_number}`);

    // Discover posts on current page
    const postsOnPage = await discoverPostsOnCurrentPage(page);

    // Filter posts by date if publishedAt is available
    const recentPosts = postsOnPage.filter((post) => {
      if (!post.publishedAt) return true; // Include if we can't determine date
      return post.publishedAt >= cutoffDate;
    });

    allPosts.push(...recentPosts);

    console.log(
      `[Fansly Automation] Found ${recentPosts.length} posts on page ${page_number} (total: ${allPosts.length})`
    );

    // If no posts found on this page, we might have reached the end
    if (postsOnPage.length === 0) {
      hasMorePages = false;
      break;
    }

    // If we found old posts, we might want to stop
    const oldPosts = postsOnPage.filter((post) => {
      return post.publishedAt && post.publishedAt < cutoffDate;
    });

    if (oldPosts.length > 0 && oldPosts.length === postsOnPage.length) {
      // All posts on this page are too old
      console.log(
        `[Fansly Automation] Reached posts older than ${daysBack} days, stopping discovery`
      );
      hasMorePages = false;
      break;
    }

    // Try to load more posts
    if (allPosts.length < maxPosts) {
      hasMorePages = await loadMorePosts(page);
      if (hasMorePages) {
        page_number++;
        // Add a delay between pages to be respectful
        await page.waitForTimeout(1000 + Math.random() * 1000);
      }
    } else {
      hasMorePages = false;
    }
  }

  console.log(`[Fansly Automation] Post discovery completed: ${allPosts.length} posts found`);

  return allPosts.slice(0, maxPosts); // Ensure we don't exceed maxPosts
};
