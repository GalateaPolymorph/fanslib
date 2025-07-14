// CSS selectors for Fansly automation
// Following the same pattern as Reddit automation

// Authentication selectors
export const LOGIN_PAGE_SELECTOR = "app-landing-page-new";
export const LOGIN_BUTTON_SELECTOR = "app-landing-page-new .btn.solid-blue:nth-child(2)";
export const LOGGED_IN_INDICATOR_SELECTOR = "app-account-avatar";

// Profile navigation selectors
export const PROFILE_AVATAR_SELECTOR = "app-account-avatar";
export const PROFILE_LINK_SELECTOR = "app-account-avatar > a";

// Post discovery selectors
export const TIMELINE_SELECTOR = "app-timeline";
export const POST_ITEM_SELECTOR = "app-post";
export const POST_LINK_SELECTOR = 'a[href*="/post/"]';
export const LOAD_MORE_BUTTON_SELECTOR = '[data-testid="load-more"]';

// Post statistics selectors
export const STATISTICS_LINK_SELECTOR = 'a[href*="/statistics/"]';
export const POST_MENU_SELECTOR = '[data-testid="post-menu"]';
export const VIEW_ANALYTICS_OPTION_SELECTOR = '[data-testid="view-analytics"]';

// Error and loading selectors
export const ERROR_MESSAGE_SELECTOR = '[data-testid="error-message"]';
export const LOADING_SPINNER_SELECTOR = '[data-testid="loading"]';
export const CAPTCHA_SELECTOR = 'iframe[src*="recaptcha"]';

// Navigation selectors
export const NEXT_PAGE_SELECTOR = '[data-testid="next-page"]';
export const PAGINATION_SELECTOR = '[data-testid="pagination"]';

// Dynamic selectors with parameters
export const POST_BY_ID_SELECTOR = (postId: string) =>
  `[data-testid="post-item"][data-post-id="${postId}"]`;

export const STATISTICS_URL_SELECTOR = (postId: string) => `a[href*="/statistics/${postId}"]`;

// Rate limiting and error detection selectors
export const RATE_LIMIT_MESSAGE_SELECTOR = '[data-testid="rate-limit"]';
export const SESSION_EXPIRED_SELECTOR = '[data-testid="session-expired"]';
export const MAINTENANCE_MODE_SELECTOR = '[data-testid="maintenance"]';

// Cookie banner and modal selectors
export const COOKIE_BANNER_SELECTOR = '[data-testid="cookie-banner"]';
export const COOKIE_ACCEPT_BUTTON_SELECTOR = '[data-testid="accept-cookies"]';
export const MODAL_CLOSE_SELECTOR = '[data-testid="modal-close"]';
export const OVERLAY_SELECTOR = '[data-testid="overlay"]';

// Age restriction modal selectors
export const AGE_RESTRICTION_MODAL_SELECTOR = "app-age-gate-modal";
export const AGE_RESTRICTION_ENTER_BUTTON_SELECTOR = "app-age-gate-modal .btn:last-of-type";

// Push notification modal selectors
export const PUSH_NOTIFICATION_MODAL_SELECTOR = "app-web-push-enable-modal";
export const PUSH_NOTIFICATION_DISMISS_BUTTON_SELECTOR =
  "app-web-push-enable-modal .btn:last-child";
