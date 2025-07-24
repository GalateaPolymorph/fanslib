import { RedditPostDraft } from "../types/post";

export const LOGIN_SELECTOR = "shreddit-app[user-logged-in]";
export const LINK_TAB_SELECTOR = '[data-select-value="LINK"]';
export const FORM_SELECTOR = "#post-submit-form";
export const TITLE_SELECTOR = "#post-composer__title faceplate-textarea-input";
export const URL_SELECTOR = "#post-composer_link faceplate-textarea-input";
export const SUBMIT_BUTTON_SELECTOR = "#submit-post-button";
export const POST_URL_SELECTOR = (draft: RedditPostDraft) =>
  `shreddit-post[post-title="${draft.caption}"]`;

export const FLAIR_MODAL_SELECTOR = "r-post-flairs-modal";
export const FLAIRS_REQUIRED_SELECTOR = `${FLAIR_MODAL_SELECTOR}[flairs-required]`;
export const FLAIR_BUTTON_SELECTOR = `${FLAIR_MODAL_SELECTOR} button`;
export const FLAIR_RADIO_SELECTOR = `${FLAIR_MODAL_SELECTOR} faceplate-radio-input[name='flairId']`;
export const FLAIR_VIEW_ALL_SELECTOR = `${FLAIR_MODAL_SELECTOR} #view-all-flairs-button`;
export const FLAIR_MODAL_SUBMIT_BUTTON_SELECTOR = `${FLAIR_MODAL_SELECTOR} #post-flair-modal-apply-button`;
