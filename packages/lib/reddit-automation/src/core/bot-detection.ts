import { Page } from "playwright";

export const detectCaptcha = async (page: Page): Promise<boolean> => {
  try {
    const captchaSelectors = [
      'iframe[src*="recaptcha"]',
      '[data-testid="captcha"]',
      ".captcha",
      "#captcha",
      'input[name="captcha"]',
    ];

    for (const selector of captchaSelectors) {
      const element = await page.$(selector);
      if (element) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

export const handleRateLimiting = async (page: Page): Promise<void> => {
  try {
    const rateLimitSelectors = [
      'text="You are doing that too much."',
      'text="Try again in"',
      '[data-testid="rate-limit"]',
    ];

    for (const selector of rateLimitSelectors) {
      const element = await page.$(selector);
      if (element) {
        const text = await element.textContent();
        const match = text?.match(/(\d+)\s*(minute|second)/);
        const waitTime = match
          ? parseInt(match[1]) * (match[2] === "minute" ? 60000 : 1000)
          : 60000;

        throw new Error(`Rate limited. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
