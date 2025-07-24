import { Page } from "playwright";
import { RedditPostDraft } from "../types/post";
import { RedditPostProgress } from "../types/progress";
import { waitForAppLoad } from "./navigation";
import {
  FLAIRS_REQUIRED_SELECTOR,
  FLAIR_BUTTON_SELECTOR,
  FLAIR_MODAL_SUBMIT_BUTTON_SELECTOR,
  FLAIR_RADIO_SELECTOR,
  FLAIR_VIEW_ALL_SELECTOR,
  FORM_SELECTOR,
  LINK_TAB_SELECTOR,
  POST_URL_SELECTOR,
  SUBMIT_BUTTON_SELECTOR,
  TITLE_SELECTOR,
  URL_SELECTOR,
} from "./selectors";

const waitForForm = async (page: Page): Promise<void> => {
  console.log("[Reddit Automation] Waiting for form...");
  await page.waitForSelector(FORM_SELECTOR, { timeout: 30000 });
  console.log("[Reddit Automation] Form found");
};

const fillInTitle = async (page: Page, draft: RedditPostDraft): Promise<void> => {
  console.log("[Reddit Automation] Waiting for title input...");
  const titleInput = await page.waitForSelector(TITLE_SELECTOR);
  console.log("[Reddit Automation] Title input found, filling in...");
  await titleInput.click();
  await page.keyboard.type(draft.caption);
};

const goToTab = async (page: Page, tabSelector: string): Promise<void> => {
  console.log("[Reddit Automation] Waiting for tab...");
  const tab = await page.$(tabSelector);
  console.log("[Reddit Automation] Tab found, clicking...");
  if (!tab) {
    console.error(`[Reddit Automation] ${tabSelector} tab not found`);
    return;
  }
  await tab.click();
};

const fillInUrl = async (page: Page, draft: RedditPostDraft): Promise<void> => {
  console.log("[Reddit Automation] Waiting for url input...");
  const urlInput = await page.waitForSelector(URL_SELECTOR);
  console.log("[Reddit Automation] Url input found, filling in...");
  await urlInput.click();
  await page.keyboard.type(draft.url);
};

const clickSubmitButton = async (page: Page): Promise<void> => {
  console.log("[Reddit Automation] Waiting for submit button...");
  const submitButton = await page.waitForSelector(SUBMIT_BUTTON_SELECTOR);
  console.log("[Reddit Automation] Submit button found, clicking...");
  await submitButton.click();
};

const findPostUrl = async (page: Page, draft: RedditPostDraft): Promise<string | null> => {
  console.log("[Reddit Automation] Waiting for post url...");
  const postUrl = await page.waitForSelector(POST_URL_SELECTOR(draft));
  const permalink = await postUrl.getAttribute("permalink");
  console.log("[Reddit Automation] Post url found:", permalink);
  return `https://www.reddit.com${permalink}`;
};

const isFlairRequired = async (page: Page): Promise<boolean> => {
  console.log("[Reddit Automation] Checking if flair is required...");
  try {
    const flairRequired = await page.waitForSelector(FLAIRS_REQUIRED_SELECTOR, { timeout: 1000 });
    console.log("[Reddit Automation] Flair required!");
    return !!flairRequired;
  } catch {
    console.log("[Reddit Automation] Flair not required!");
    return false;
  }
};

const selectFlair = async (page: Page, draft: RedditPostDraft): Promise<void> => {
  console.log("[Reddit Automation] Waiting for flair button...");
  const flairButton = await page.waitForSelector(FLAIR_BUTTON_SELECTOR);
  console.log("[Reddit Automation] Flair button found, clicking...");
  await flairButton.click();

  console.log("[Reddit Automation] Waiting for flair modal...");
  await page.waitForTimeout(1000);

  const viewAllFlairsButton = await page.waitForSelector(FLAIR_VIEW_ALL_SELECTOR);
  console.log("[Reddit Automation] View all flairs button found, clicking...");
  await viewAllFlairsButton.click();

  const flairSelector = await page.locator(FLAIR_RADIO_SELECTOR).filter({ hasText: draft.flair });

  console.log("[Reddit Automation] Flair selector:", await flairSelector.textContent());

  console.log("[Reddit Automation] Flair selector found, clicking...");
  await flairSelector.click();
  const flairModalSubmitButton = await page.waitForSelector(FLAIR_MODAL_SUBMIT_BUTTON_SELECTOR);
  console.log("[Reddit Automation] Flair modal submit button found, clicking...");
  await flairModalSubmitButton.click();
};

export const submitPost = async (
  page: Page,
  draft: RedditPostDraft,
  onProgress?: (progress: RedditPostProgress) => void
): Promise<string | null> => {
  if (draft.type !== "Link") {
    console.error(`[Reddit Automation] Unsupported post type: ${draft.type}`);
    return null;
  }

  onProgress?.({
    stage: "posting",
    message: "Submitting post...",
  });

  await waitForForm(page);
  await goToTab(page, LINK_TAB_SELECTOR);
  await fillInTitle(page, draft);
  await fillInUrl(page, draft);
  if (await isFlairRequired(page)) {
    await selectFlair(page, draft);
  }
  await clickSubmitButton(page);
  await waitForAppLoad(page);
  return findPostUrl(page, draft);
};
