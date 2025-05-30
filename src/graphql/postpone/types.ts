export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /**
   * The `BigInt` scalar type represents non-fractional whole numeric values.
   * `BigInt` is not constrained to 32-bit like the `Int` type and thus is a less
   * compatible type.
   */
  BigInt: { input: any; output: any };
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: any; output: any };
  /**
   * The `GenericScalar` scalar type represents a generic
   * GraphQL scalar value that could be:
   * String, Boolean, Int, Float, List or Object.
   */
  GenericScalar: { input: any; output: any };
  /**
   * Allows use of a JSON String for input / output from the GraphQL schema.
   *
   * Use of this type is *not recommended* as you lose the benefits of having a defined, static
   * schema (one of the key benefits of GraphQL).
   */
  JSONString: { input: any; output: any };
  /**
   * The `Time` scalar type represents a Time value as
   * specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  Time: { input: any; output: any };
};

export type ApiMutation = {
  acknowledgeSubmissionErrors: Maybe<AcknowledgeSubmissionErrors>;
  addModAlert: Maybe<AddModAlert>;
  bulkCreateRedditPosts: Maybe<BulkCreateRedditPosts>;
  /** Bulk delete multiple post submissions from Postpone */
  bulkDeleteRedditPostSubmissions: Maybe<BulkDeleteRedditPostSubmissions>;
  /** Bulk delete multiple posts from Postpone */
  bulkDeleteRedditPosts: Maybe<BulkDeleteRedditPosts>;
  /** Bulk delete multiple submissions from reddit.com */
  bulkDeleteRedditSubmissions: Maybe<BulkDeleteRedditSubmissions>;
  bulkUpdateAutoRemoval: Maybe<BulkUpdateAutoRemoval>;
  bulkUpdateAutoSpaceSubmissions: Maybe<BulkUpdateAutoSpaceSubmissions>;
  bulkUpdateComment: Maybe<BulkUpdateComment>;
  bulkUpdateMovePostAt: Maybe<BulkUpdateMovePostAt>;
  bulkUpdatePostOptions: Maybe<BulkUpdatePostOptions>;
  bulkUpdateProfileCrosspost: Maybe<BulkUpdateProfileCrosspost>;
  bulkUpdateRedditUsername: Maybe<BulkUpdateRedditUsername>;
  cancelSubmissionAutoRemoval: Maybe<CancelSubmissionAutoRemoval>;
  changeRedditPostSubmissionTitle: Maybe<ChangeRedditPostSubmissionTitle>;
  createCampaign: Maybe<CreateCampaign>;
  createRedditPost: Maybe<CreateRedditPost>;
  deleteCampaign: Maybe<DeleteCampaign>;
  deleteRedditPost: Maybe<DeleteRedditPost>;
  deleteRedditPostSubmission: Maybe<DeleteRedditPostSubmission>;
  deleteRedditSubmission: Maybe<DeleteRedditSubmission>;
  duplicateCampaign: Maybe<DuplicateCampaign>;
  duplicateRedditPost: Maybe<DuplicateRedditPost>;
  duplicateRedditPostSubmission: Maybe<DuplicateRedditPostSubmission>;
  editCampaign: Maybe<EditCampaign>;
  editRedditPost: Maybe<EditRedditPost>;
  removeModAlert: Maybe<RemoveModAlert>;
  retryRedditPost: Maybe<RetryRedditPost>;
  scheduleBlueskyPost: Maybe<ScheduleBlueskyPost>;
  scheduleFacebookPost: Maybe<ScheduleFacebookPost>;
  scheduleInstagramPost: Maybe<ScheduleInstagramPost>;
  scheduleLinkedInPost: Maybe<ScheduleLinkedInPost>;
  scheduleMastodonPost: Maybe<ScheduleMastodonPost>;
  schedulePinterestPost: Maybe<SchedulePinterestPost>;
  scheduleThreadsPost: Maybe<ScheduleThreadsPost>;
  scheduleTikTokPost: Maybe<ScheduleTikTokPost>;
  scheduleTumblrPost: Maybe<ScheduleTumblrPost>;
  scheduleTweet: Maybe<ScheduleTweet>;
  scheduleYouTubePost: Maybe<ScheduleYouTubePost>;
  setDefaultPostSettingsFields: Maybe<SetDefaultPostSettingsFields>;
  setFrequencyWarningsEnabled: Maybe<SetFrequencyWarningsEnabled>;
  /** Submits a Reddit post to Reddit immediately. */
  submitRedditPost: Maybe<SubmitRedditPost>;
  /** Submits an individual post submission to Reddit immediately. */
  submitRedditSubmission: Maybe<SubmitRedditSubmission>;
  updateDefaultPostSettings: Maybe<UpdateDefaultPostSettings>;
  updateRedditPostSubmissionPostAt: Maybe<UpdateRedditPostSubmissionPostAt>;
};

export type ApiMutationAcknowledgeSubmissionErrorsArgs = {
  postIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  submissionIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiMutationAddModAlertArgs = {
  moderatorUsername: Scalars["String"]["input"];
};

export type ApiMutationBulkCreateRedditPostsArgs = {
  compressedPosts: InputMaybe<Array<InputMaybe<Scalars["Int"]["input"]>>>;
  fileName: InputMaybe<Scalars["String"]["input"]>;
  posts: InputMaybe<Array<InputMaybe<BulkRedditPostInput>>>;
  skipPostRequirementsValidation: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ApiMutationBulkDeleteRedditPostSubmissionsArgs = {
  submissionIds: Array<InputMaybe<Scalars["String"]["input"]>>;
};

export type ApiMutationBulkDeleteRedditPostsArgs = {
  postIds: Array<InputMaybe<Scalars["Int"]["input"]>>;
};

export type ApiMutationBulkDeleteRedditSubmissionsArgs = {
  submissionIds: Array<InputMaybe<Scalars["String"]["input"]>>;
};

export type ApiMutationBulkUpdateAutoRemovalArgs = {
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinUpvotes: InputMaybe<Scalars["Int"]["input"]>;
  submissionIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiMutationBulkUpdateAutoSpaceSubmissionsArgs = {
  spaceAmount: InputMaybe<Scalars["Int"]["input"]>;
  spaceUnit: InputMaybe<Scalars["String"]["input"]>;
  submissionIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiMutationBulkUpdateCommentArgs = {
  comment: InputMaybe<Scalars["String"]["input"]>;
  submissionIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiMutationBulkUpdateMovePostAtArgs = {
  moveAmount: Scalars["Int"]["input"];
  moveDirection: Scalars["String"]["input"];
  moveUnit: Scalars["String"]["input"];
  submissionIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiMutationBulkUpdatePostOptionsArgs = {
  nsfw: InputMaybe<Scalars["Boolean"]["input"]>;
  sendRepliesToInbox: InputMaybe<Scalars["Boolean"]["input"]>;
  spoiler: InputMaybe<Scalars["Boolean"]["input"]>;
  submissionIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiMutationBulkUpdateProfileCrosspostArgs = {
  profileCrosspost: InputMaybe<Scalars["Boolean"]["input"]>;
  submissionIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiMutationBulkUpdateRedditUsernameArgs = {
  redditUsername: Scalars["String"]["input"];
  submissionIds: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiMutationCancelSubmissionAutoRemovalArgs = {
  submissionId: Scalars["String"]["input"];
};

export type ApiMutationChangeRedditPostSubmissionTitleArgs = {
  submissionId: Scalars["ID"]["input"];
  title: Scalars["String"]["input"];
};

export type ApiMutationCreateCampaignArgs = {
  comment: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  nsfw: InputMaybe<Scalars["Boolean"]["input"]>;
  postType: Scalars["String"]["input"];
  redditUsername: Scalars["String"]["input"];
  sendRepliesToInbox: InputMaybe<Scalars["Boolean"]["input"]>;
  spoiler: InputMaybe<Scalars["Boolean"]["input"]>;
  submissions: Array<InputMaybe<CampaignDefaultSubmissionInput>>;
  title: Scalars["String"]["input"];
};

export type ApiMutationCreateRedditPostArgs = {
  campaignId: InputMaybe<Scalars["String"]["input"]>;
  comment: InputMaybe<Scalars["String"]["input"]>;
  content: InputMaybe<Scalars["String"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  imageId: InputMaybe<Scalars["String"]["input"]>;
  imageUploadLocation: InputMaybe<Scalars["String"]["input"]>;
  link: InputMaybe<Scalars["String"]["input"]>;
  media: InputMaybe<MediaInput>;
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  nsfw: InputMaybe<Scalars["Boolean"]["input"]>;
  pollChoices: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  pollDuration: InputMaybe<Scalars["Int"]["input"]>;
  publishingStatus?: InputMaybe<PublishingStatusType>;
  redditUsername: InputMaybe<Scalars["String"]["input"]>;
  sendRepliesToInbox: InputMaybe<Scalars["Boolean"]["input"]>;
  skipPostRequirementsValidation: InputMaybe<Scalars["Boolean"]["input"]>;
  spoiler: InputMaybe<Scalars["Boolean"]["input"]>;
  submissions: Array<InputMaybe<SubmissionInput>>;
  title: Scalars["String"]["input"];
};

export type ApiMutationDeleteCampaignArgs = {
  id: Scalars["String"]["input"];
};

export type ApiMutationDeleteRedditPostArgs = {
  postId: Scalars["String"]["input"];
};

export type ApiMutationDeleteRedditPostSubmissionArgs = {
  submissionId: Scalars["String"]["input"];
};

export type ApiMutationDeleteRedditSubmissionArgs = {
  submissionId: Scalars["String"]["input"];
};

export type ApiMutationDuplicateCampaignArgs = {
  campaignId: Scalars["String"]["input"];
};

export type ApiMutationDuplicateRedditPostArgs = {
  postId: Scalars["String"]["input"];
};

export type ApiMutationDuplicateRedditPostSubmissionArgs = {
  submissionId: Scalars["ID"]["input"];
};

export type ApiMutationEditCampaignArgs = {
  comment: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  nsfw: InputMaybe<Scalars["Boolean"]["input"]>;
  postType: Scalars["String"]["input"];
  redditUsername: Scalars["String"]["input"];
  sendRepliesToInbox: InputMaybe<Scalars["Boolean"]["input"]>;
  spoiler: InputMaybe<Scalars["Boolean"]["input"]>;
  submissions: Array<InputMaybe<CampaignDefaultSubmissionInput>>;
  title: Scalars["String"]["input"];
};

export type ApiMutationEditRedditPostArgs = {
  campaignId: InputMaybe<Scalars["String"]["input"]>;
  comment: InputMaybe<Scalars["String"]["input"]>;
  content: InputMaybe<Scalars["String"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  id: Scalars["String"]["input"];
  imageId: InputMaybe<Scalars["String"]["input"]>;
  imageUploadLocation: InputMaybe<Scalars["String"]["input"]>;
  link: InputMaybe<Scalars["String"]["input"]>;
  media: InputMaybe<MediaInput>;
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  nsfw: InputMaybe<Scalars["Boolean"]["input"]>;
  pollChoices: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  pollDuration: InputMaybe<Scalars["Int"]["input"]>;
  publishingStatus?: InputMaybe<PublishingStatusType>;
  redditUsername: InputMaybe<Scalars["String"]["input"]>;
  sendRepliesToInbox: InputMaybe<Scalars["Boolean"]["input"]>;
  skipPostRequirementsValidation: InputMaybe<Scalars["Boolean"]["input"]>;
  spoiler: InputMaybe<Scalars["Boolean"]["input"]>;
  submissions: Array<InputMaybe<SubmissionInput>>;
  title: Scalars["String"]["input"];
};

export type ApiMutationRemoveModAlertArgs = {
  moderatorUsername: Scalars["String"]["input"];
};

export type ApiMutationRetryRedditPostArgs = {
  postId: Scalars["String"]["input"];
};

export type ApiMutationScheduleBlueskyPostArgs = {
  input: ScheduleBlueskyPostInput;
};

export type ApiMutationScheduleFacebookPostArgs = {
  input: ScheduleFacebookPostInput;
};

export type ApiMutationScheduleInstagramPostArgs = {
  input: ScheduleInstagramPostInput;
};

export type ApiMutationScheduleLinkedInPostArgs = {
  input: ScheduleLinkedInPostInput;
};

export type ApiMutationScheduleMastodonPostArgs = {
  input: ScheduleMastodonPostInput;
};

export type ApiMutationSchedulePinterestPostArgs = {
  input: SchedulePinterestPostInput;
};

export type ApiMutationScheduleThreadsPostArgs = {
  input: ScheduleThreadsPostInput;
};

export type ApiMutationScheduleTikTokPostArgs = {
  input: ScheduleTikTokPostInput;
};

export type ApiMutationScheduleTumblrPostArgs = {
  input: ScheduleTumblrPostInput;
};

export type ApiMutationScheduleTweetArgs = {
  input: ScheduleTweetInput;
};

export type ApiMutationScheduleYouTubePostArgs = {
  input: ScheduleYouTubePostInput;
};

export type ApiMutationSetDefaultPostSettingsFieldsArgs = {
  input: DefaultPostSettingsInputType;
};

export type ApiMutationSetFrequencyWarningsEnabledArgs = {
  enabled: Scalars["Boolean"]["input"];
};

export type ApiMutationSubmitRedditPostArgs = {
  postId: Scalars["String"]["input"];
};

export type ApiMutationSubmitRedditSubmissionArgs = {
  submissionId: Scalars["String"]["input"];
};

export type ApiMutationUpdateDefaultPostSettingsArgs = {
  applyToAllPostTemplates: InputMaybe<Scalars["Boolean"]["input"]>;
  applyToAllPosts: InputMaybe<Scalars["Boolean"]["input"]>;
  autoSpaceIntervals: InputMaybe<Array<InputMaybe<AutoSpaceIntervalInputType>>>;
  frequencyWarningsEnabled: InputMaybe<Scalars["Boolean"]["input"]>;
  generateFreshLinks: InputMaybe<Scalars["Boolean"]["input"]>;
  generateFreshLinksAnonymously: InputMaybe<Scalars["Boolean"]["input"]>;
  gifUploadLocation: InputMaybe<Scalars["String"]["input"]>;
  imageUploadLocation: InputMaybe<Scalars["String"]["input"]>;
  maxTries: InputMaybe<Scalars["Int"]["input"]>;
  nsfw: InputMaybe<Scalars["Boolean"]["input"]>;
  postType: InputMaybe<Scalars["String"]["input"]>;
  profileCrosspost: InputMaybe<Scalars["Boolean"]["input"]>;
  redditUsername: InputMaybe<Scalars["String"]["input"]>;
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinUpvotes: InputMaybe<Scalars["Int"]["input"]>;
  repostProtectionEnabled: InputMaybe<Scalars["Boolean"]["input"]>;
  repostProtectionIntervalAmount: InputMaybe<Scalars["Int"]["input"]>;
  repostProtectionIntervalUnit: InputMaybe<Scalars["String"]["input"]>;
  sendRepliesToInbox: InputMaybe<Scalars["Boolean"]["input"]>;
  spoiler: InputMaybe<Scalars["Boolean"]["input"]>;
  uploadLocation: InputMaybe<Scalars["String"]["input"]>;
  videoUploadLocation: InputMaybe<Scalars["String"]["input"]>;
};

export type ApiMutationUpdateRedditPostSubmissionPostAtArgs = {
  id: Scalars["ID"]["input"];
  postAt: Scalars["DateTime"]["input"];
};

export type ApiQuery = {
  _debug: Maybe<DjangoDebug>;
  accountMembers: Maybe<Array<Maybe<AccountMember>>>;
  aggregatePostMetrics: Maybe<MetricsAggregatesType>;
  analytics: Maybe<SubredditTopPostsType>;
  analyticsPostWordCloud: Maybe<AnalyticsWordCloudType>;
  analyticsSubmissions: Maybe<AnalyticsSubmissionPaginatedListType>;
  batchSubreddits: Maybe<Array<Maybe<SubredditType>>>;
  blueskyAnalytics: Maybe<BlueskyAnalyticsType>;
  campaign: Maybe<CampaignType>;
  campaigns: Maybe<Array<Maybe<CampaignType>>>;
  facebookAnalytics: Maybe<FacebookAnalyticsType>;
  hashtagGroups: Maybe<Array<Maybe<HashtagGroupType>>>;
  hourlyEngagement: Maybe<EngagementType>;
  importGroup: Maybe<ImportGroupType>;
  instagramAnalytics: Maybe<InstagramAnalyticsType>;
  lastSubmission: Maybe<RedditPostSubmissionType>;
  linkFlair: Maybe<Array<Maybe<FlairType>>>;
  linkedinAnalytics: Maybe<LinkedInAnalyticsType>;
  mastodonAnalytics: Maybe<MastodonAnalyticsType>;
  media: Maybe<MediaList>;
  mediaLabels: Maybe<Array<Maybe<MediaLabelType>>>;
  nextSubmission: Maybe<RedditPostSubmissionType>;
  nsfwSubreddits: Maybe<Array<Maybe<InternalSubredditType>>>;
  postAnalytics: Maybe<PostAnalyticsType>;
  postRequirements: Maybe<Array<Maybe<SubredditPostRequirementsType>>>;
  postTemplates: Maybe<PostTemplatePaginatedList>;
  postTimeSeriesMetrics: Maybe<Array<Maybe<MetricsDataPointType>>>;
  previousTitles: Maybe<Array<Maybe<PreviousTitleType>>>;
  profile: Maybe<UserType>;
  publicSecureConnectLink: Maybe<PublicSecureConnectLinkType>;
  recentImportGroups: Maybe<Array<Maybe<ImportGroupType>>>;
  redditPost: Maybe<RedditPostType>;
  /** Get a RedditPostSubmission by ID, optionally preparing it for submission */
  redditPostSubmission: Maybe<RedditPostSubmissionType>;
  redditPosts: Maybe<Array<Maybe<RedditPostType>>>;
  redditSubmissions: Maybe<SubmissionsPaginatedList>;
  redditor: Maybe<RedditRedditorType>;
  redditorAnalytics: Maybe<RedditorAnalyticsType>;
  redditorPinnedSubmissions: Maybe<Array<Maybe<RedditSubmissionType>>>;
  redditorSubmissions: Maybe<Array<Maybe<RedditSubmissionType>>>;
  scheduledPostAnalytics: Maybe<ScheduledPostAnalyticsType>;
  /** DEPRECATED. Use scheduledSubmissions instead. */
  scheduledRedditPosts: Maybe<PostsPaginatedList>;
  /** Posts scheduled to be submitted to Reddit in the future. Returns a paginated list of RedditPostSubmissionType. */
  scheduledSubmissions: Maybe<SubmissionsPaginatedList>;
  searchSubreddits: Maybe<Array<Maybe<SubredditType>>>;
  secureConnectLinks: Maybe<Array<Maybe<SecureConnectLinkType>>>;
  semanticSubredditSearch: Maybe<Array<Maybe<InternalSubredditType>>>;
  similarSubreddits: Maybe<Array<Maybe<InternalSubredditType>>>;
  socialAccountAnalytics: Maybe<SocialAccountAnalyticsType>;
  socialAccounts: Maybe<Array<Maybe<SocialAccountType>>>;
  /**
   * Successful submissions to Reddit. These submissions have a result
   * (SubmissionResultType) but not an error (SubmissionErrorType).
   */
  submissions: Maybe<SubmissionsPaginatedList>;
  /**
   * Failed submissions to Reddit. These submissions have an error
   * (SubmissionErrorType) but not a result (SubmissionResultType).
   */
  submissionsWithErrors: Maybe<SubmissionsPaginatedList>;
  subreddit: Maybe<SubredditType>;
  subredditRules: Maybe<Array<Maybe<SubredditRuleType>>>;
  subreddits: Maybe<Array<Maybe<SubredditType>>>;
  subredditsTopSubmissions: Maybe<Array<Maybe<InternalRedditSubmissionType>>>;
  threadsAnalytics: Maybe<ThreadsAnalyticsType>;
  tiktokAnalytics: Maybe<TikTokAnalyticsType>;
  timezones: Maybe<Array<Maybe<TimezoneType>>>;
  trashedRedditPosts: Maybe<Array<Maybe<RedditPostType>>>;
  tumblrAnalytics: Maybe<TumblrAnalyticsType>;
  twitterAnalytics: Maybe<TwitterAnalyticsType>;
  uniqueCampaignsSubreddits: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  uniqueSubreddits: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  youtubeAnalytics: Maybe<YouTubeAnalyticsType>;
};

export type ApiQueryAggregatePostMetricsArgs = {
  campaigns: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  endDate: Scalars["DateTime"]["input"];
  metrics: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  socialAccountId: InputMaybe<Scalars["ID"]["input"]>;
  socialAccountIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  startDate: Scalars["DateTime"]["input"];
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryAnalyticsArgs = {
  subreddit: Scalars["String"]["input"];
  timezone: Scalars["String"]["input"];
};

export type ApiQueryAnalyticsPostWordCloudArgs = {
  campaigns: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  endDate: Scalars["DateTime"]["input"];
  socialAccountIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  startDate: Scalars["DateTime"]["input"];
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryAnalyticsSubmissionsArgs = {
  campaigns: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: InputMaybe<Scalars["String"]["input"]>;
  page: InputMaybe<Scalars["Int"]["input"]>;
  socialAccountIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  unlinked: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ApiQueryBatchSubredditsArgs = {
  subreddits: Array<InputMaybe<Scalars["String"]["input"]>>;
};

export type ApiQueryBlueskyAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryCampaignArgs = {
  id: Scalars["Int"]["input"];
};

export type ApiQueryCampaignsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryFacebookAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryHourlyEngagementArgs = {
  socialAccountId: Scalars["ID"]["input"];
};

export type ApiQueryImportGroupArgs = {
  id: Scalars["ID"]["input"];
};

export type ApiQueryInstagramAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryLastSubmissionArgs = {
  subreddit: Scalars["String"]["input"];
};

export type ApiQueryLinkFlairArgs = {
  subreddit: Scalars["String"]["input"];
};

export type ApiQueryLinkedinAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryMastodonAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryMediaArgs = {
  externalIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  fileType: InputMaybe<FileType>;
  ids: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  imgurUrls: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  labelIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: InputMaybe<Scalars["String"]["input"]>;
  page: InputMaybe<Scalars["Int"]["input"]>;
  search: InputMaybe<Scalars["String"]["input"]>;
  unusedInPlatforms: InputMaybe<Array<InputMaybe<SocialPlatform>>>;
  unusedInSubreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  unusedOnly: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ApiQueryNextSubmissionArgs = {
  subreddit: Scalars["String"]["input"];
};

export type ApiQueryNsfwSubredditsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
};

export type ApiQueryPostAnalyticsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  campaigns: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryPostRequirementsArgs = {
  subreddit: Scalars["String"]["input"];
};

export type ApiQueryPostTemplatesArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: InputMaybe<Scalars["String"]["input"]>;
  page: InputMaybe<Scalars["Int"]["input"]>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryPostTimeSeriesMetricsArgs = {
  campaigns: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  metrics: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  socialAccountId: InputMaybe<Scalars["ID"]["input"]>;
  socialAccountIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  startDate: Scalars["DateTime"]["input"];
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryPreviousTitlesArgs = {
  text: Scalars["String"]["input"];
};

export type ApiQueryPublicSecureConnectLinkArgs = {
  token: InputMaybe<Scalars["String"]["input"]>;
};

export type ApiQueryRedditPostArgs = {
  id: Scalars["Int"]["input"];
};

export type ApiQueryRedditPostSubmissionArgs = {
  id: Scalars["ID"]["input"];
  prepare?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ApiQueryRedditPostsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
  orderBy: InputMaybe<Scalars["String"]["input"]>;
  page: InputMaybe<Scalars["Int"]["input"]>;
};

export type ApiQueryRedditSubmissionsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  campaigns: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  clientIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  errorCodes: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  labels: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  links: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  mediaIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  page: InputMaybe<Scalars["Int"]["input"]>;
  removalCategories: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  search: InputMaybe<Scalars["String"]["input"]>;
  socialAccountIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  sortField: InputMaybe<SortFieldType>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
  submissionType: InputMaybe<SubmissionType>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryRedditorArgs = {
  username: Scalars["String"]["input"];
};

export type ApiQueryRedditorAnalyticsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type ApiQueryRedditorPinnedSubmissionsArgs = {
  username: Scalars["String"]["input"];
};

export type ApiQueryRedditorSubmissionsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
  username: Scalars["String"]["input"];
};

export type ApiQueryScheduledPostAnalyticsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  campaigns: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryScheduledRedditPostsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  campaigns: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  comments: InputMaybe<Scalars["String"]["input"]>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  importGroupId: InputMaybe<Scalars["ID"]["input"]>;
  includeAccounts: InputMaybe<Scalars["Boolean"]["input"]>;
  includeCampaigns: InputMaybe<Scalars["Boolean"]["input"]>;
  includeLabels: InputMaybe<Scalars["Boolean"]["input"]>;
  includeLinks: InputMaybe<Scalars["Boolean"]["input"]>;
  includeSubreddits: InputMaybe<Scalars["Boolean"]["input"]>;
  labels: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  links: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  media: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  orderBy: InputMaybe<Scalars["String"]["input"]>;
  page: InputMaybe<Scalars["Int"]["input"]>;
  publishingStatus: InputMaybe<PublishingStatusType>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQueryScheduledSubmissionsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  campaigns: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  clientIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  comments: InputMaybe<Scalars["String"]["input"]>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  importGroupId: InputMaybe<Scalars["ID"]["input"]>;
  includeAccounts: InputMaybe<Scalars["Boolean"]["input"]>;
  includeCampaigns: InputMaybe<Scalars["Boolean"]["input"]>;
  includeLabels: InputMaybe<Scalars["Boolean"]["input"]>;
  includeLinks: InputMaybe<Scalars["Boolean"]["input"]>;
  includeSubmitted: InputMaybe<Scalars["Boolean"]["input"]>;
  includeSubreddits: InputMaybe<Scalars["Boolean"]["input"]>;
  labels: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  links: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  media: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  orderBy: InputMaybe<Scalars["String"]["input"]>;
  overdueOnly: InputMaybe<Scalars["Boolean"]["input"]>;
  page: InputMaybe<Scalars["Int"]["input"]>;
  publishingMethod: InputMaybe<PublishingMethodType>;
  publishingStatus: InputMaybe<PublishingStatusType>;
  search: InputMaybe<Scalars["String"]["input"]>;
  socialAccountIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
};

export type ApiQuerySearchSubredditsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
  query: Scalars["String"]["input"];
};

export type ApiQuerySemanticSubredditSearchArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
  maxSubscribers: InputMaybe<Scalars["Int"]["input"]>;
  minSubscribers: InputMaybe<Scalars["Int"]["input"]>;
  query: Scalars["String"]["input"];
  workSafety: InputMaybe<SafetyFilter>;
};

export type ApiQuerySimilarSubredditsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
  maxSubscribers: InputMaybe<Scalars["Int"]["input"]>;
  minSubscribers: InputMaybe<Scalars["Int"]["input"]>;
  subredditNames: Array<InputMaybe<Scalars["String"]["input"]>>;
  workSafety: InputMaybe<SafetyFilter>;
};

export type ApiQuerySocialAccountAnalyticsArgs = {
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: InputMaybe<Scalars["ID"]["input"]>;
  socialAccountIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQuerySocialAccountsArgs = {
  platform: InputMaybe<Scalars["String"]["input"]>;
};

export type ApiQuerySubmissionsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  campaigns: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  clientIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  labels: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  links: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  media: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  orderBy: InputMaybe<Scalars["String"]["input"]>;
  page: InputMaybe<Scalars["Int"]["input"]>;
  removalCategories: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  title: InputMaybe<Scalars["String"]["input"]>;
};

export type ApiQuerySubmissionsWithErrorsArgs = {
  accounts: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  clientIds: InputMaybe<Array<InputMaybe<Scalars["ID"]["input"]>>>;
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  errorCodes: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  media: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  orderBy: InputMaybe<Scalars["String"]["input"]>;
  page: InputMaybe<Scalars["Int"]["input"]>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
  subreddits: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  title: InputMaybe<Scalars["String"]["input"]>;
};

export type ApiQuerySubredditArgs = {
  subreddit: Scalars["String"]["input"];
};

export type ApiQuerySubredditRulesArgs = {
  subreddit: Scalars["String"]["input"];
};

export type ApiQuerySubredditsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
  query: Scalars["String"]["input"];
};

export type ApiQuerySubredditsTopSubmissionsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
  subredditNames: Array<InputMaybe<Scalars["String"]["input"]>>;
};

export type ApiQueryThreadsAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryTiktokAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryTumblrAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryTwitterAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type ApiQueryUniqueSubredditsArgs = {
  endDate: InputMaybe<Scalars["DateTime"]["input"]>;
  limit: InputMaybe<Scalars["Int"]["input"]>;
  startDate: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type ApiQueryYoutubeAnalyticsArgs = {
  endDate: Scalars["DateTime"]["input"];
  groupBy: InputMaybe<Scalars["String"]["input"]>;
  socialAccountId: Scalars["ID"]["input"];
  startDate: Scalars["DateTime"]["input"];
};

export type AccountAggregates = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
  username: Maybe<Scalars["String"]["output"]>;
};

/**
 * A smaller User type that is used when accessing an account's members. This
 * smaller version leaves out some sensitive fields, such as a user's API token.
 */
export type AccountMember = {
  canAccessAnalytics: Maybe<Scalars["Boolean"]["output"]>;
  canAccessDefaultPostSettings: Maybe<Scalars["Boolean"]["output"]>;
  canAccessSettingsContentHosts: Maybe<Scalars["Boolean"]["output"]>;
  canAccessSettingsCustomSchedules: Maybe<Scalars["Boolean"]["output"]>;
  canAccessSettingsDataExport: Maybe<Scalars["Boolean"]["output"]>;
  canAccessSettingsIpProxies: Maybe<Scalars["Boolean"]["output"]>;
  canConnectSocialAccounts: Maybe<Scalars["Boolean"]["output"]>;
  canManageAllSocialAccounts: Maybe<Scalars["Boolean"]["output"]>;
  canManageMembers: Maybe<Scalars["Boolean"]["output"]>;
  contentPermission: Maybe<ContentPermissionType>;
  /** The confirmed, in-force email. This is only set if the user goes through the email confirmation process. */
  email: Maybe<Scalars["String"]["output"]>;
  fullName: Scalars["String"]["output"];
  hashedId: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  inboxPermission: Maybe<InboxPermissionType>;
  isActive: Scalars["Boolean"]["output"];
  managedClients: Array<ClientType>;
  managedRedditAccounts: Array<RedditUserType>;
  managedSocialAccounts: Array<SocialAccountType>;
  managesAllAccounts: Scalars["Boolean"]["output"];
  /** An email that is pending confirmation. */
  pendingEmail: Scalars["String"]["output"];
  registeredAt: Scalars["DateTime"]["output"];
  subredditManagerPermission: Maybe<SubredditManagerPermissionType>;
  timezone: Maybe<Scalars["String"]["output"]>;
  username: Scalars["String"]["output"];
};

export type AccountType = {
  aiAssistantAccess: Maybe<Scalars["String"]["output"]>;
  allowedContentStorage: Maybe<Scalars["BigInt"]["output"]>;
  /** The number of monthly DMs this account is allowed to submit */
  allowedMonthlyDms: Scalars["Int"]["output"];
  /**
   * The number of monthly social media posts that accounts that do not support
   * multiple social platforms can schedule per month from new non-Twitter
   * platforms, such as Instagram or other new platforms.
   */
  allowedMonthlyNewPlatformPosts: Scalars["Int"]["output"];
  /** The number of monthly social media posts (other than Tweets) that this account is allowed to submit */
  allowedMonthlyPosts: Scalars["Int"]["output"];
  /** The number of monthly Tweets this account is allowed to submit */
  allowedMonthlyTweets: Scalars["Int"]["output"];
  /** The number of social accounts this Postpone account is allowed to connect */
  allowedRedditAccounts: Scalars["Int"]["output"];
  allowedSocialAccounts: Maybe<Scalars["Int"]["output"]>;
  billingTerm: Maybe<BillingTerm>;
  /** Whether this account supports auto-retweets or not */
  canUseAutoRetweet: Scalars["Boolean"]["output"];
  /** Set to True to allow a user to use Fresh Links */
  canUseFreshLinks: Scalars["Boolean"]["output"];
  churnkeyHash: Maybe<Scalars["String"]["output"]>;
  clientCount: Maybe<Scalars["Int"]["output"]>;
  currentPeriodEnd: Maybe<Scalars["DateTime"]["output"]>;
  dateCreated: Scalars["DateTime"]["output"];
  dateUpdated: Scalars["DateTime"]["output"];
  dmsSentThisMonth: Maybe<Scalars["Int"]["output"]>;
  hasApiAccess: Scalars["Boolean"]["output"];
  /** Whether the Account can access the Client Manager */
  hasClientManager: Scalars["Boolean"]["output"];
  /** Whether this plan supports multiple users per account */
  hasMultiUser: Scalars["Boolean"]["output"];
  hasPremiumSupport: Scalars["Boolean"]["output"];
  humanReadableAllowedContentStorage: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  instagramPostsSubmittedThisMonth: Maybe<Scalars["Int"]["output"]>;
  name: Scalars["String"]["output"];
  ownerId: Maybe<Scalars["ID"]["output"]>;
  plan: PlanType;
  postsSubmittedThisMonth: Maybe<Scalars["Int"]["output"]>;
  stripeCustomerId: Scalars["String"]["output"];
  subscriptionId: Scalars["String"]["output"];
  subscriptionStatus: AccountsAccountSubscriptionStatusChoices;
  /** Whether the account supports social media platforms beyond Reddit or not */
  supportsMultipleSocialPlatforms: Scalars["Boolean"]["output"];
  tweetsSubmittedThisMonth: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type AccountsAccountSubscriptionStatusChoices =
  /** Active */
  | "ACTIVE"
  /** Canceled */
  | "CANCELED"
  /** Incomplete */
  | "INCOMPLETE"
  /** Expired */
  | "INCOMPLETE_EXPIRED"
  /** None */
  | "NONE"
  /** Past due */
  | "PAST_DUE"
  /** Paused */
  | "PAUSED"
  /** Trialing */
  | "TRIALING"
  /** Unpaid */
  | "UNPAID";

export type AcknowledgeSubmissionErrors = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type AddModAlert = {
  success: Maybe<Scalars["Boolean"]["output"]>;
};

/** An enumeration. */
export type AllowRepliesFrom = "EVERYBODY" | "FOLLOWED_USERS" | "MENTIONED_USERS" | "NOBODY";

export type AnalyticsSubmissionPaginatedListType = {
  objects: Maybe<Array<Maybe<AnalyticsSubmissionType>>>;
  total: Maybe<Scalars["Int"]["output"]>;
};

export type AnalyticsSubmissionType = {
  dateSubmitted: Maybe<Scalars["DateTime"]["output"]>;
  metrics: Maybe<Array<Maybe<MetricType>>>;
  platformId: Maybe<Scalars["ID"]["output"]>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  text: Maybe<Scalars["String"]["output"]>;
  thumbnailUrl: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
};

export type AnalyticsWordCloudType = {
  words: Maybe<Array<Maybe<AnalyticsWordCloudWordType>>>;
};

export type AnalyticsWordCloudWordType = {
  count: Maybe<Scalars["Int"]["output"]>;
  word: Maybe<Scalars["String"]["output"]>;
};

export type AutoSpaceIntervalInputType = {
  amount: InputMaybe<Scalars["Int"]["input"]>;
  unit: InputMaybe<Scalars["String"]["input"]>;
};

export type AutoSpaceIntervalType = {
  amount: Maybe<Scalars["Int"]["output"]>;
  unit: Maybe<Scalars["String"]["output"]>;
};

export type BillingTerm = "MONTHLY" | "NONE" | "YEARLY";

export type BlueskyAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<BlueskyPostSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopBlueskyPostSubmissionType>>>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalReplies: Maybe<Scalars["Int"]["output"]>;
  totalReposts: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type BlueskyBlueskyPostAllowRepliesFromChoices =
  /** Everybody */
  | "EVERYBODY"
  /** Followed users */
  | "FOLLOWED_USERS"
  /** Mentioned users */
  | "MENTIONED_USERS"
  /** Nobody */
  | "NOBODY";

export type BlueskyPostSubmissionAnalyticsDataPointType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalReplies: Maybe<Scalars["Int"]["output"]>;
  totalReposts: Maybe<Scalars["Int"]["output"]>;
};

export type BlueskyPostSubmissionInputType = {
  contentWarning: ContentWarning;
  final: InputMaybe<Scalars["Boolean"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  /** IETF BCP 47 language codes */
  languages: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  order: Scalars["Int"]["input"];
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinLikes: InputMaybe<Scalars["Int"]["input"]>;
  repostAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  repostAtUnit: InputMaybe<Scalars["String"]["input"]>;
  repostFromSocialAccount: InputMaybe<SocialAccountInputType>;
  repostRepeatDays: InputMaybe<Scalars["Int"]["input"]>;
  /** Additional tags on the post */
  tags: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  text: Scalars["String"]["input"];
};

export type BlueskyPostSubmissionType = SocialSubmissionInterface & {
  contentWarning: Maybe<ContentWarning>;
  error: Maybe<SocialSubmissionErrorType>;
  final: Scalars["Boolean"]["output"];
  gallery: Maybe<GalleryType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  /** IETF language codes for each language used in the post */
  languages: Array<Scalars["String"]["output"]>;
  media: Maybe<MediaType>;
  order: Scalars["Int"]["output"];
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  /** Additional hashtags, in addition to any included in post text and facets */
  tags: Array<Scalars["String"]["output"]>;
  target: Maybe<Scalars["String"]["output"]>;
  text: Scalars["String"]["output"];
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type BlueskyPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  allowRepliesFrom: Maybe<BlueskyBlueskyPostAllowRepliesFromChoices>;
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<BlueskyPostSubmissionType>>>;
};

export type BulkCreateRedditPosts = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  importGroupId: Maybe<Scalars["ID"]["output"]>;
  row: Maybe<Scalars["Int"]["output"]>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  validationErrors: Maybe<Array<Maybe<RowValidationErrorType>>>;
};

/** Bulk delete multiple post submissions from Postpone */
export type BulkDeleteRedditPostSubmissions = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

/** Bulk delete multiple posts from Postpone */
export type BulkDeleteRedditPosts = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

/** Bulk delete multiple submissions from reddit.com */
export type BulkDeleteRedditSubmissions = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type BulkRedditPostInput = {
  campaign: InputMaybe<Scalars["Int"]["input"]>;
  comment: InputMaybe<Scalars["String"]["input"]>;
  content: InputMaybe<Scalars["String"]["input"]>;
  flair: InputMaybe<Scalars["String"]["input"]>;
  link: InputMaybe<Scalars["String"]["input"]>;
  manual: InputMaybe<Scalars["Boolean"]["input"]>;
  nsfw: InputMaybe<Scalars["Boolean"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
  replies: InputMaybe<Scalars["Boolean"]["input"]>;
  spoiler: InputMaybe<Scalars["Boolean"]["input"]>;
  subreddit: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  user: Scalars["String"]["input"];
};

export type BulkUpdateAutoRemoval = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  updatedCount: Maybe<Scalars["Int"]["output"]>;
};

export type BulkUpdateAutoSpaceSubmissions = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  updatedCount: Maybe<Scalars["Int"]["output"]>;
};

export type BulkUpdateComment = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  updatedCount: Maybe<Scalars["Int"]["output"]>;
};

export type BulkUpdateMovePostAt = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  updatedCount: Maybe<Scalars["Int"]["output"]>;
};

export type BulkUpdatePostOptions = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  updatedCount: Maybe<Scalars["Int"]["output"]>;
};

export type BulkUpdateProfileCrosspost = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  updatedCount: Maybe<Scalars["Int"]["output"]>;
};

export type BulkUpdateRedditUsername = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  updatedCount: Maybe<Scalars["Int"]["output"]>;
};

export type CampaignAggregates = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  campaignId: Maybe<Scalars["String"]["output"]>;
  campaignName: Maybe<Scalars["String"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type CampaignDefaultSubmissionInput = {
  comment: InputMaybe<Scalars["String"]["input"]>;
  /** The validation_id of the parent submission to crosspost from */
  crosspostFrom: InputMaybe<Scalars["String"]["input"]>;
  flairId: InputMaybe<Scalars["String"]["input"]>;
  id: InputMaybe<Scalars["String"]["input"]>;
  order: InputMaybe<Scalars["Int"]["input"]>;
  overrideComment: InputMaybe<Scalars["Boolean"]["input"]>;
  postAtExpression: InputMaybe<Scalars["String"]["input"]>;
  postAtTime: InputMaybe<Scalars["Time"]["input"]>;
  postAtWeekOffset: InputMaybe<Scalars["String"]["input"]>;
  postAtWeekday: InputMaybe<Scalars["Int"]["input"]>;
  profileCrosspost: InputMaybe<Scalars["Boolean"]["input"]>;
  redditUsername: InputMaybe<Scalars["String"]["input"]>;
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinUpvotes: InputMaybe<Scalars["Int"]["input"]>;
  subreddit: Scalars["String"]["input"];
  title: InputMaybe<Scalars["String"]["input"]>;
  /** Internal ID to map response validation errors to specific submissions and link to a parent submission in crosspost_from */
  validationId: InputMaybe<Scalars["String"]["input"]>;
};

export type CampaignDefaultSubmissionType = {
  campaign: CampaignType;
  /** Comment override for the subreddit submission */
  comment: Scalars["String"]["output"];
  crosspostFrom: Maybe<CampaignDefaultSubmissionType>;
  flairId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  order: Scalars["Int"]["output"];
  /**
   * Indicates the submission should override the post comment, either by
   * submitting no comment or submitting a different comment
   */
  overrideComment: Scalars["Boolean"]["output"];
  /** The expression to use to calculate post_at. Example: "best_next_7_days". */
  postAtExpression: Scalars["String"]["output"];
  postAtTime: Maybe<Scalars["Time"]["output"]>;
  postAtWeekOffset: Maybe<Scalars["String"]["output"]>;
  /** The weekday number in ISO format (1=Monday, 7=Sunday) */
  postAtWeekday: Maybe<Scalars["Int"]["output"]>;
  /** Immediately crosspost this submission to the user's profile */
  profileCrosspost: Scalars["Boolean"]["output"];
  /** The Reddit username to submit the post as (crossposts only) */
  redditUsername: Scalars["String"]["output"];
  /** The number of hours or days after the post should be removed */
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  /** The karma threshold required to remove the submission from Reddit. Only posts with karma lower than this will be removed. */
  removeMinUpvotes: Maybe<Scalars["Int"]["output"]>;
  subreddit: Scalars["String"]["output"];
  /** Title override for the subreddit submission */
  title: Scalars["String"]["output"];
};

export type CampaignType = {
  comment: Scalars["String"]["output"];
  dateCreated: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  nsfw: Scalars["Boolean"]["output"];
  postType: CampaignsCampaignPostTypeChoices;
  /** The Reddit username to submit the post as */
  redditUsername: Scalars["String"]["output"];
  sendRepliesToInbox: Scalars["Boolean"]["output"];
  spoiler: Scalars["Boolean"]["output"];
  submissions: Array<CampaignDefaultSubmissionType>;
  title: Scalars["String"]["output"];
};

/** An enumeration. */
export type CampaignsCampaignPostTypeChoices =
  /** Image post */
  | "IMAGE"
  /** Link post */
  | "LINK"
  /** No preference */
  | "NO_PREFERENCE"
  /** Poll post */
  | "POLL"
  /** Self-post */
  | "SELF";

export type CancelSubmissionAutoRemoval = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ChangeRedditPostSubmissionTitle = {
  success: Maybe<Scalars["Boolean"]["output"]>;
  validationErrors: Maybe<Array<Maybe<ValidationErrorType>>>;
};

export type ClientType = {
  connectLink: Maybe<PublicClientConnectLinkType>;
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  redditAccounts: Array<RedditUserType>;
  socialAccounts: Array<SocialAccountType>;
  website: Scalars["String"]["output"];
};

/** An enumeration. */
export type CommunityLabel = "DRUGS" | "FOR_EVERYONE" | "MATURE" | "SEXUAL_THEMES" | "VIOLENCE";

/** An enumeration. */
export type ContentPermissionType = "FULL" | "OWN_CONTENT";

/** An enumeration. */
export type ContentWarning = "NONE" | "NUDITY" | "PORN" | "SUGGESTIVE";

export type CoverImageType = {
  account: AccountType;
  altText: Scalars["String"]["output"];
  createdBy: Maybe<AccountMember>;
  dateCreated: Scalars["DateTime"]["output"];
  dateUpdated: Scalars["DateTime"]["output"];
  externalId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  mimeType: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  /** The time in ms of the frame that represents the video cover. */
  offsetMs: Maybe<Scalars["Int"]["output"]>;
  /** Media size in bytes */
  size: Scalars["BigInt"]["output"];
  source: Scalars["String"]["output"];
  url: Scalars["String"]["output"];
};

export type CreateCampaign = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type CreateRedditPost = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  redditPost: Maybe<RedditPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  validationErrors: Maybe<Array<Maybe<ValidationErrorType>>>;
};

export type DefaultPostSettingsInputType = {
  applyToAllPostTemplates: InputMaybe<Scalars["Boolean"]["input"]>;
  applyToAllPosts: InputMaybe<Scalars["Boolean"]["input"]>;
  autoSpaceIntervals: InputMaybe<Array<InputMaybe<AutoSpaceIntervalInputType>>>;
  frequencyWarningsEnabled: InputMaybe<Scalars["Boolean"]["input"]>;
  generateFreshLinks: InputMaybe<Scalars["Boolean"]["input"]>;
  generateFreshLinksAnonymously: InputMaybe<Scalars["Boolean"]["input"]>;
  gifUploadLocation: InputMaybe<Scalars["String"]["input"]>;
  imageUploadLocation: InputMaybe<Scalars["String"]["input"]>;
  maxTries: InputMaybe<Scalars["Int"]["input"]>;
  nsfw: InputMaybe<Scalars["Boolean"]["input"]>;
  postType: InputMaybe<Scalars["String"]["input"]>;
  profileCrosspost: InputMaybe<Scalars["Boolean"]["input"]>;
  redditUsername: InputMaybe<Scalars["String"]["input"]>;
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinUpvotes: InputMaybe<Scalars["Int"]["input"]>;
  repostProtectionEnabled: InputMaybe<Scalars["Boolean"]["input"]>;
  repostProtectionIntervalAmount: InputMaybe<Scalars["Int"]["input"]>;
  repostProtectionIntervalUnit: InputMaybe<Scalars["String"]["input"]>;
  sendRepliesToInbox: InputMaybe<Scalars["Boolean"]["input"]>;
  spoiler: InputMaybe<Scalars["Boolean"]["input"]>;
  uploadLocation: InputMaybe<Scalars["String"]["input"]>;
  videoUploadLocation: InputMaybe<Scalars["String"]["input"]>;
};

export type DefaultPostSettingsType = {
  autoSpaceIntervals: Maybe<Array<Maybe<AutoSpaceIntervalType>>>;
  /** Global flag to disable subreddit frequency warnings across all subreddits */
  frequencyWarningsEnabled: Scalars["Boolean"]["output"];
  /** Generate unique Imgur links for each submission */
  generateFreshLinks: Scalars["Boolean"]["output"];
  /** Upload fresh links anonymously, not to the user's Imgur account */
  generateFreshLinksAnonymously: Scalars["Boolean"]["output"];
  gifUploadLocation: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  imageUploadLocation: Maybe<Scalars["String"]["output"]>;
  /** The maximum number of times we will reschedule a post that fails */
  maxTries: Scalars["Int"]["output"];
  modAlerts: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  nsfw: Scalars["Boolean"]["output"];
  postType: PostsDefaultPostSettingsPostTypeChoices;
  profileCrosspost: Scalars["Boolean"]["output"];
  /** The Reddit username to submit the post as */
  redditUsername: Scalars["String"]["output"];
  /** The number of hours or days after the post should be removed */
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  /** The karma threshold required to remove the submission from Reddit. Only posts with karma lower than this will be removed. */
  removeMinUpvotes: Maybe<Scalars["Int"]["output"]>;
  /** Global flag to disable repost protection across all subreddits */
  repostProtectionEnabled: Scalars["Boolean"]["output"];
  /** The number of months allowed between reposts */
  repostProtectionIntervalAmount: Scalars["Int"]["output"];
  repostProtectionIntervalUnit: Maybe<Scalars["String"]["output"]>;
  sendRepliesToInbox: Scalars["Boolean"]["output"];
  spoiler: Scalars["Boolean"]["output"];
  uploadLocation: Maybe<Scalars["String"]["output"]>;
  videoUploadLocation: Maybe<Scalars["String"]["output"]>;
};

export type DeleteCampaign = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type DeleteRedditPost = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type DeleteRedditPostSubmission = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type DeleteRedditSubmission = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

/** Debugging information for the current query. */
export type DjangoDebug = {
  /** Raise exceptions for this API query. */
  exceptions: Maybe<Array<Maybe<DjangoDebugException>>>;
  /** Executed SQL queries for this API query. */
  sql: Maybe<Array<Maybe<DjangoDebugSql>>>;
};

/** Represents a single exception raised. */
export type DjangoDebugException = {
  /** The class of the exception */
  excType: Scalars["String"]["output"];
  /** The message of the exception */
  message: Scalars["String"]["output"];
  /** The stack trace */
  stack: Scalars["String"]["output"];
};

/** Represents a single database query made to a Django managed DB. */
export type DjangoDebugSql = {
  /** The Django database alias (e.g. 'default'). */
  alias: Scalars["String"]["output"];
  /** Duration of this database query in seconds. */
  duration: Scalars["Float"]["output"];
  /** Postgres connection encoding if available. */
  encoding: Maybe<Scalars["String"]["output"]>;
  /** Whether this database query was a SELECT. */
  isSelect: Scalars["Boolean"]["output"];
  /** Whether this database query took more than 10 seconds. */
  isSlow: Scalars["Boolean"]["output"];
  /** Postgres isolation level if available. */
  isoLevel: Maybe<Scalars["String"]["output"]>;
  /** JSON encoded database query parameters. */
  params: Scalars["String"]["output"];
  /** The raw SQL of this query, without params. */
  rawSql: Scalars["String"]["output"];
  /** The actual SQL sent to this database. */
  sql: Maybe<Scalars["String"]["output"]>;
  /** Start time of this database query. */
  startTime: Scalars["Float"]["output"];
  /** Stop time of this database query. */
  stopTime: Scalars["Float"]["output"];
  /** Postgres transaction ID if available. */
  transId: Maybe<Scalars["String"]["output"]>;
  /** Postgres transaction status if available. */
  transStatus: Maybe<Scalars["String"]["output"]>;
  /** The type of database being used (e.g. postrgesql, mysql, sqlite). */
  vendor: Scalars["String"]["output"];
};

export type DuplicateCampaign = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  newCampaign: Maybe<CampaignType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type DuplicateRedditPost = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  newPost: Maybe<RedditPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type DuplicateRedditPostSubmission = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  newPost: Maybe<RedditPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type EditCampaign = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type EditRedditPost = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
  validationErrors: Maybe<Array<Maybe<ValidationErrorType>>>;
};

export type EngagementType = {
  dataSource: Maybe<Scalars["String"]["output"]>;
  engagement: Maybe<Array<Maybe<HourlyEngagementType>>>;
};

export type FacebookAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<FacebookSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopFacebookSubmissionType>>>;
  totalClicks: Maybe<Scalars["Int"]["output"]>;
  totalClicksUnique: Maybe<Scalars["Int"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalEngagedFan: Maybe<Scalars["Int"]["output"]>;
  totalEngagedUsers: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalImpressionsUnique: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalVideoViews: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type FacebookFacebookPostSubmissionMediaTypeChoices =
  /** Post */
  | "POST"
  /** Reel */
  | "REEL"
  /** Story */
  | "STORY";

/** An enumeration. */
export type FacebookMediaType = "POST" | "REEL" | "STORY";

export type FacebookPostSubmissionInputType = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  mediaType: FacebookMediaType;
  postAt: Scalars["DateTime"]["input"];
};

export type FacebookPostSubmissionType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  mediaType: FacebookFacebookPostSubmissionMediaTypeChoices;
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type FacebookPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  gallery: Maybe<GalleryType>;
  id: Maybe<Scalars["ID"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<FacebookPostSubmissionType>>>;
  text: Scalars["String"]["output"];
};

export type FacebookSubmissionAnalyticsDataPointType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalClicks: Maybe<Scalars["Int"]["output"]>;
  totalClicksUnique: Maybe<Scalars["Int"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalEngagedFan: Maybe<Scalars["Int"]["output"]>;
  totalEngagedUsers: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalImpressionsUnique: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalVideoViews: Maybe<Scalars["Int"]["output"]>;
};

export type FileType = "ALL" | "GIF" | "IMAGE" | "VIDEO";

export type FlairType = {
  id: Maybe<Scalars["String"]["output"]>;
  text: Maybe<Scalars["String"]["output"]>;
};

export type GalleryInput = {
  galleryMediaSet: Array<InputMaybe<GalleryMediaInput>>;
  id: InputMaybe<Scalars["ID"]["input"]>;
};

export type GalleryMediaInput = {
  caption: InputMaybe<Scalars["String"]["input"]>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  media: MediaInput;
  order: Scalars["Int"]["input"];
  outboundUrl: InputMaybe<Scalars["String"]["input"]>;
};

export type GalleryMediaType = {
  caption: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  media: Maybe<MediaType>;
  order: Scalars["Int"]["output"];
  outboundUrl: Scalars["String"]["output"];
};

export type GalleryType = {
  galleryMediaSet: Maybe<Array<Maybe<GalleryMediaType>>>;
  id: Scalars["ID"]["output"];
};

export type HashtagGroupType = {
  color: Scalars["String"]["output"];
  hashtags: Array<HashtagType>;
  id: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type HashtagType = {
  id: Scalars["ID"]["output"];
  /** Hashtag name without # */
  name: Scalars["String"]["output"];
};

export type HourlyEngagementType = {
  hour: Maybe<Scalars["Int"]["output"]>;
  value: Maybe<Scalars["Float"]["output"]>;
  weekday: Maybe<Scalars["Int"]["output"]>;
};

export type HourlyPostType = {
  day: Maybe<Scalars["Int"]["output"]>;
  hour: Maybe<Scalars["Int"]["output"]>;
  posts: Maybe<Scalars["Int"]["output"]>;
};

export type ImportErrorType = {
  message: Maybe<Scalars["String"]["output"]>;
};

export type ImportGroupType = {
  dateCreated: Scalars["DateTime"]["output"];
  errors: Maybe<Array<Maybe<ImportErrorType>>>;
  fileName: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  postCount: Maybe<Scalars["Int"]["output"]>;
  status: PostsImportGroupStatusChoices;
};

/** An enumeration. */
export type InboxPermissionType = "COMMENTS_ONLY" | "FULL" | "MESSAGES_ONLY" | "NONE";

export type InstagramAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<InstagramSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopInstagramSubmissionType>>>;
  totalCarouselAlbumEngagement: Maybe<Scalars["Int"]["output"]>;
  totalCarouselAlbumImpressions: Maybe<Scalars["Int"]["output"]>;
  totalCarouselAlbumReach: Maybe<Scalars["Int"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalFollows: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalProfileActivity: Maybe<Scalars["Int"]["output"]>;
  totalProfileVisits: Maybe<Scalars["Int"]["output"]>;
  totalReach: Maybe<Scalars["Int"]["output"]>;
  totalShares: Maybe<Scalars["Int"]["output"]>;
  totalTotalInteractions: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type InstagramInstagramPostSubmissionMediaTypeChoices =
  /** Carousel */
  | "CAROUSEL"
  /** Feed post */
  | "FEED_POST"
  /** Reel */
  | "REEL"
  /** Story */
  | "STORY";

/** An enumeration. */
export type InstagramMediaType = "CAROUSEL" | "FEED_POST" | "REEL" | "STORY";

export type InstagramPostSubmissionInputType = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  mediaType: InstagramMediaType;
  postAt: Scalars["DateTime"]["input"];
  shareToFeed: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type InstagramPostSubmissionType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  mediaType: InstagramInstagramPostSubmissionMediaTypeChoices;
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  /** Whether a reel should be shared to the main feed as well */
  shareToFeed: Scalars["Boolean"]["output"];
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type InstagramPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  caption: Scalars["String"]["output"];
  collaborators: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  /** The first comment to be posted with the post */
  firstComment: Scalars["String"]["output"];
  gallery: GalleryType;
  id: Maybe<Scalars["ID"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<InstagramPostSubmissionType>>>;
};

export type InstagramSubmissionAnalyticsDataPointType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalCarouselAlbumEngagement: Maybe<Scalars["Int"]["output"]>;
  totalCarouselAlbumImpressions: Maybe<Scalars["Int"]["output"]>;
  totalCarouselAlbumReach: Maybe<Scalars["Int"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalFollows: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalProfileActivity: Maybe<Scalars["Int"]["output"]>;
  totalProfileVisits: Maybe<Scalars["Int"]["output"]>;
  totalReach: Maybe<Scalars["Int"]["output"]>;
  totalShares: Maybe<Scalars["Int"]["output"]>;
  totalTotalInteractions: Maybe<Scalars["Int"]["output"]>;
};

export type InternalRedditSubmissionType = {
  author: Scalars["String"]["output"];
  comments: Scalars["Int"]["output"];
  dateCreated: Scalars["DateTime"]["output"];
  domain: Scalars["String"]["output"];
  gilded: Scalars["Int"]["output"];
  linkFlairText: Scalars["String"]["output"];
  nsfw: Scalars["Boolean"]["output"];
  numCrossposts: Scalars["Int"]["output"];
  permalink: Scalars["String"]["output"];
  postType: RedditSubmissionPostTypeChoices;
  redditId: Scalars["String"]["output"];
  subredditName: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  upvotes: Scalars["Int"]["output"];
};

export type InternalSubredditType = {
  activeUserCount: Maybe<Scalars["Int"]["output"]>;
  allowGalleries: Maybe<Scalars["Boolean"]["output"]>;
  allowImages: Maybe<Scalars["Boolean"]["output"]>;
  allowPolls: Maybe<Scalars["Boolean"]["output"]>;
  allowVideos: Maybe<Scalars["Boolean"]["output"]>;
  banned: Scalars["Boolean"]["output"];
  communityIcon: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  descriptionHtml: Maybe<Scalars["String"]["output"]>;
  iconImg: Maybe<Scalars["String"]["output"]>;
  isCrosspostableSubreddit: Maybe<Scalars["Boolean"]["output"]>;
  keyColor: Maybe<Scalars["String"]["output"]>;
  linkFlair: Maybe<Array<Maybe<FlairType>>>;
  moderators: Maybe<Array<Maybe<SubredditModeratorType>>>;
  name: Scalars["String"]["output"];
  nsfw: Scalars["Boolean"]["output"];
  primaryColor: Maybe<Scalars["String"]["output"]>;
  public: Scalars["Boolean"]["output"];
  publicDescription: Maybe<Scalars["String"]["output"]>;
  redditId: Scalars["String"]["output"];
  submissionType: Maybe<Scalars["String"]["output"]>;
  subredditType: Scalars["String"]["output"];
  subscribers: Scalars["Int"]["output"];
  title: Maybe<Scalars["String"]["output"]>;
  verificationRequired: Maybe<Scalars["Boolean"]["output"]>;
  verificationRequirement: Maybe<Scalars["String"]["output"]>;
};

export type LinkedInAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<LinkedInPostSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopLinkedInPostSubmissionType>>>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
};

export type LinkedInPostSubmissionAnalyticsDataPointType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
};

export type LinkedInPostSubmissionInputType = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
};

export type LinkedInPostSubmissionType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type LinkedInPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  gallery: Maybe<GalleryType>;
  id: Maybe<Scalars["ID"]["output"]>;
  /** The article URL (article-only field). */
  link: Scalars["String"]["output"];
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<LinkedInPostSubmissionType>>>;
  /** The main text of the post (aka commentary). */
  text: Scalars["String"]["output"];
  /** The visibility of the post. */
  visibility: LinkedinLinkedInPostVisibilityChoices;
};

/** An enumeration. */
export type LinkedinLinkedInPostVisibilityChoices =
  /** Connections */
  | "CONNECTIONS"
  /** Logged in users */
  | "LOGGED_IN"
  /** Public */
  | "PUBLIC";

export type MastodonAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<MastodonPostSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopMastodonPostSubmissionType>>>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalReplies: Maybe<Scalars["Int"]["output"]>;
  totalReposts: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type MastodonMastodonPostSubmissionVisibilityChoices =
  /** Direct */
  | "DIRECT"
  /** Private */
  | "PRIVATE"
  /** Public */
  | "PUBLIC"
  /** Unlisted */
  | "UNLISTED";

export type MastodonPostSubmissionAnalyticsDataPointType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalReplies: Maybe<Scalars["Int"]["output"]>;
  totalReposts: Maybe<Scalars["Int"]["output"]>;
};

export type MastodonPostSubmissionInputType = {
  contentWarning: InputMaybe<Scalars["String"]["input"]>;
  final: InputMaybe<Scalars["Boolean"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  language: InputMaybe<Scalars["String"]["input"]>;
  order: Scalars["Int"]["input"];
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinLikes: InputMaybe<Scalars["Int"]["input"]>;
  repostAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  repostAtUnit: InputMaybe<Scalars["String"]["input"]>;
  repostFromSocialAccount: InputMaybe<SocialAccountInputType>;
  repostRepeatDays: InputMaybe<Scalars["Int"]["input"]>;
  text: Scalars["String"]["input"];
  visibility: Scalars["String"]["input"];
};

export type MastodonPostSubmissionType = SocialSubmissionInterface & {
  contentWarning: Scalars["String"]["output"];
  error: Maybe<SocialSubmissionErrorType>;
  final: Scalars["Boolean"]["output"];
  gallery: Maybe<GalleryType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  /** ISO 639 language codes for the language used in the post */
  language: Scalars["String"]["output"];
  media: Maybe<MediaType>;
  order: Scalars["Int"]["output"];
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  text: Scalars["String"]["output"];
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
  visibility: MastodonMastodonPostSubmissionVisibilityChoices;
};

export type MastodonPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<MastodonPostSubmissionType>>>;
};

export type MediaInput = {
  altText: InputMaybe<Scalars["String"]["input"]>;
  /** The image or video content info from Uploadcare */
  contentInfo: InputMaybe<Scalars["GenericScalar"]["input"]>;
  externalId: Scalars["String"]["input"];
  hostedUrl: InputMaybe<Scalars["String"]["input"]>;
  imgurUrl: InputMaybe<Scalars["String"]["input"]>;
  labels: InputMaybe<Array<InputMaybe<MediaLabelInput>>>;
  mimeType: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  size: Scalars["BigInt"]["input"];
  source: Scalars["String"]["input"];
  url: Scalars["String"]["input"];
};

export type MediaLabelInput = {
  color: Scalars["String"]["input"];
  id: InputMaybe<Scalars["String"]["input"]>;
  text: Scalars["String"]["input"];
};

export type MediaLabelType = {
  color: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  text: Scalars["String"]["output"];
};

export type MediaList = {
  objects: Maybe<Array<Maybe<MediaType>>>;
  total: Maybe<Scalars["Int"]["output"]>;
};

export type MediaType = {
  account: AccountType;
  altText: Scalars["String"]["output"];
  coverImage: Maybe<CoverImageType>;
  createdBy: Maybe<AccountMember>;
  dateCreated: Scalars["DateTime"]["output"];
  dateUpdated: Scalars["DateTime"]["output"];
  duration: Maybe<Scalars["Int"]["output"]>;
  externalId: Scalars["String"]["output"];
  /** The URL of the media on a host site */
  hostedUrl: Scalars["String"]["output"];
  humanReadableSize: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  /** Imgur URL of the media for Imgur link posts */
  imgurUrl: Scalars["String"]["output"];
  isGif: Maybe<Scalars["Boolean"]["output"]>;
  isImage: Maybe<Scalars["Boolean"]["output"]>;
  isVideo: Maybe<Scalars["Boolean"]["output"]>;
  labels: Array<MediaLabelType>;
  mimeType: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  scheduledBlueskyPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledFacebookPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledInstagramPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledLinkedInPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledMastodonPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledPinterestPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledThreadsPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledTikTokPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledTumblrPosts: Maybe<Scalars["Int"]["output"]>;
  scheduledTweets: Maybe<Scalars["Int"]["output"]>;
  scheduledYouTubePosts: Maybe<Scalars["Int"]["output"]>;
  size: Maybe<Scalars["BigInt"]["output"]>;
  source: Scalars["String"]["output"];
  submittedBlueskyPosts: Maybe<Scalars["Int"]["output"]>;
  submittedFacebookPosts: Maybe<Scalars["Int"]["output"]>;
  submittedInstagramPosts: Maybe<Scalars["Int"]["output"]>;
  submittedLinkedInPosts: Maybe<Scalars["Int"]["output"]>;
  submittedMastodonPosts: Maybe<Scalars["Int"]["output"]>;
  submittedPinterestPosts: Maybe<Scalars["Int"]["output"]>;
  submittedPosts: Maybe<Scalars["Int"]["output"]>;
  submittedThreadsPosts: Maybe<Scalars["Int"]["output"]>;
  submittedTikTokPosts: Maybe<Scalars["Int"]["output"]>;
  submittedTumblrPosts: Maybe<Scalars["Int"]["output"]>;
  submittedTweets: Maybe<Scalars["Int"]["output"]>;
  submittedYouTubePosts: Maybe<Scalars["Int"]["output"]>;
  thumbnailUrl: Maybe<Scalars["String"]["output"]>;
  url: Scalars["String"]["output"];
};

export type MetricType = {
  aggregation: Maybe<Scalars["String"]["output"]>;
  metric: Maybe<Scalars["String"]["output"]>;
  value: Maybe<Scalars["Float"]["output"]>;
};

export type MetricsAggregatesType = {
  metrics: Maybe<Array<Maybe<MetricType>>>;
};

export type MetricsDataPointType = {
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  metrics: Maybe<Array<Maybe<MetricType>>>;
};

export type MinimalSocialAccountType = {
  avatarUrl: Maybe<Scalars["String"]["output"]>;
  formattedUsername: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  platform: SocialaccountsSocialAccountPlatformChoices;
  username: Scalars["String"]["output"];
};

export type NGram = {
  n: Maybe<Scalars["Int"]["output"]>;
  phrases: Maybe<Array<Maybe<NGramPhrase>>>;
};

export type NGramPhrase = {
  frequency: Maybe<Scalars["Int"]["output"]>;
  phrase: Maybe<Scalars["String"]["output"]>;
};

export type PinterestPostSubmissionInputType = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
};

export type PinterestPostSubmissionType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type PinterestPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  /** The board to which the Pin belongs. */
  boardId: Scalars["String"]["output"];
  /** The board section to which the Pin belongs. */
  boardSectionId: Scalars["String"]["output"];
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  description: Scalars["String"]["output"];
  /** Dominant pin color (hex). */
  dominantColor: Scalars["String"]["output"];
  gallery: GalleryType;
  id: Maybe<Scalars["ID"]["output"]>;
  link: Scalars["String"]["output"];
  media: Maybe<MediaType>;
  /** Private note for the Pin. */
  note: Scalars["String"]["output"];
  pinType: Maybe<Scalars["String"]["output"]>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<PinterestPostSubmissionType>>>;
  title: Scalars["String"]["output"];
};

export type PlanType = {
  aiAssistantAccess: Maybe<Scalars["String"]["output"]>;
  allowedContentStorage: Maybe<Scalars["BigInt"]["output"]>;
  /** The number of monthly DMs this account is allowed to automate */
  allowedMonthlyDms: Scalars["Int"]["output"];
  /**
   * The number of monthly social media posts that accounts that do not support
   * multiple social platforms can schedule per month from new non-Twitter
   * platforms, such as Instagram or other new platforms.
   */
  allowedMonthlyNewPlatformPosts: Scalars["Int"]["output"];
  /** The number of monthly social media posts (other than Tweets) that this account is allowed to submit */
  allowedMonthlyPosts: Scalars["Int"]["output"];
  /** The number of monthly Tweets the account is allowed to schedule */
  allowedMonthlyTweets: Scalars["Int"]["output"];
  /** The number of Reddit accounts the account is allowed to connect */
  allowedRedditAccounts: Scalars["Int"]["output"];
  annualPrice: Scalars["Float"]["output"];
  /** Whether this plan supports auto-retweets or not */
  canUseAutoRetweet: Scalars["Boolean"]["output"];
  /** Whether this plan supports Fresh Links or not */
  canUseFreshLinks: Scalars["Boolean"]["output"];
  code: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  hasApiAccess: Scalars["Boolean"]["output"];
  /** Whether this plan supports accessing the Client Manager */
  hasClientManager: Scalars["Boolean"]["output"];
  /** Whether this plan supports multiple users per account */
  hasMultiUser: Scalars["Boolean"]["output"];
  hasPremiumSupport: Scalars["Boolean"]["output"];
  humanReadableAllowedContentStorage: Maybe<Scalars["String"]["output"]>;
  /** Whether this plan is considered an enterprise plan or not */
  isEnterprise: Scalars["Boolean"]["output"];
  label: Scalars["String"]["output"];
  monthlyPrice: Scalars["Float"]["output"];
  paypalAnnualId: Maybe<Scalars["String"]["output"]>;
  paypalMonthlyId: Maybe<Scalars["String"]["output"]>;
  stripeAnnualId: Scalars["String"]["output"];
  stripeMonthlyId: Scalars["String"]["output"];
  /** Whether this plan supports social media platforms beyond Reddit or not */
  supportsMultipleSocialPlatforms: Scalars["Boolean"]["output"];
  trialPeriodDays: Maybe<Scalars["Int"]["output"]>;
  /** Whether this plan is visible to end-users or not */
  visible: Scalars["Boolean"]["output"];
};

export type PollInputType = {
  choices: Scalars["GenericScalar"]["input"];
  durationMinutes: Scalars["Int"]["input"];
  id: InputMaybe<Scalars["ID"]["input"]>;
};

export type PollType = {
  choices: Maybe<Scalars["GenericScalar"]["output"]>;
  dateCreated: Scalars["DateTime"]["output"];
  dateUpdated: Scalars["DateTime"]["output"];
  durationMinutes: Scalars["Int"]["output"];
  id: Scalars["ID"]["output"];
};

export type PostAnalyticsDataPointType = {
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  startOfWeek: Maybe<Scalars["DateTime"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type PostAnalyticsType = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<PostAnalyticsDataPointType>>>;
  firstSubmitted: Maybe<Scalars["DateTime"]["output"]>;
  lastSubmitted: Maybe<Scalars["DateTime"]["output"]>;
  postsByAccount: Maybe<Array<Maybe<AccountAggregates>>>;
  postsByCampaign: Maybe<Array<Maybe<CampaignAggregates>>>;
  postsBySubreddit: Maybe<Array<Maybe<SubredditAggregates>>>;
  topLinks: Maybe<Array<Maybe<TopLinkType>>>;
  topSites: Maybe<Array<Maybe<TopSiteType>>>;
  topSubmissions: Maybe<Array<Maybe<TopSubmissionType>>>;
  topSubreddits: Maybe<Array<Maybe<TopSubredditType>>>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type PostTemplatePaginatedList = {
  objects: Maybe<Array<Maybe<CampaignType>>>;
  total: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type PostsDefaultPostSettingsPostTypeChoices =
  /** Image */
  | "IMAGE"
  /** Link */
  | "LINK"
  /** Poll */
  | "POLL"
  /** Post */
  | "POST";

/** An enumeration. */
export type PostsImportGroupStatusChoices =
  /** Failed */
  | "FAILED"
  /** Pending */
  | "PENDING"
  /** Success */
  | "SUCCESS";

export type PostsPaginatedList = {
  objects: Maybe<Array<Maybe<RedditPostType>>>;
  total: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type PostsRedditPostPublishingStatusChoices =
  /** Draft */
  | "DRAFT"
  /** Ready to Publish */
  | "READY_TO_PUBLISH";

/** An enumeration. */
export type PostsRedditPostSubmissionPublishingMethodChoices =
  /** Automatic */
  | "AUTOMATIC"
  /** Manual */
  | "MANUAL";

export type PreviousTitleType = {
  count: Maybe<Scalars["Int"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
};

/** An enumeration. */
export type PrivacyLevel =
  | "FOLLOWER_OF_CREATOR"
  | "MUTUAL_FOLLOW_FRIENDS"
  | "PUBLIC_TO_EVERYONE"
  | "SELF_ONLY";

/** An enumeration. */
export type PrivacyStatus = "PRIVATE" | "PUBLIC" | "UNLISTED";

export type PublicClientConnectLinkType = {
  /** Token duration in days. Use 0 for 'never expires'. */
  expirationDays: Scalars["Int"]["output"];
  expires: Maybe<Scalars["DateTime"]["output"]>;
  inviterEmail: Maybe<Scalars["String"]["output"]>;
  inviterName: Maybe<Scalars["String"]["output"]>;
  isActive: Scalars["Boolean"]["output"];
  isExpired: Maybe<Scalars["Boolean"]["output"]>;
  isValid: Maybe<Scalars["Boolean"]["output"]>;
  socialAccounts: Maybe<Array<Maybe<MinimalSocialAccountType>>>;
  token: Scalars["String"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
};

export type PublicSecureConnectLinkType = {
  expires: Scalars["DateTime"]["output"];
  inviterEmail: Maybe<Scalars["String"]["output"]>;
  inviterName: Maybe<Scalars["String"]["output"]>;
  isValid: Maybe<Scalars["Boolean"]["output"]>;
  platform: UsersSecureConnectLinkPlatformChoices;
  status: UsersSecureConnectLinkStatusChoices;
  token: Scalars["String"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
};

/** An enumeration. */
export type PublishingMethodType = "AUTOMATIC" | "MANUAL";

/** An enumeration. */
export type PublishingStatusType = "DRAFT" | "READY_TO_PUBLISH";

export type RedditPostSubmissionType = {
  /** Comment override for the subreddit submission */
  comment: Scalars["String"]["output"];
  crosspostFrom: Maybe<RedditPostSubmissionType>;
  crosspostFromId: Maybe<Scalars["String"]["output"]>;
  /** The date the post was either submitted or failed to submit */
  dateSubmitted: Maybe<Scalars["DateTime"]["output"]>;
  error: Maybe<SubmissionErrorType>;
  flairId: Scalars["String"]["output"];
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  isReadyForImgurUpload: Maybe<Scalars["Boolean"]["output"]>;
  /** Link override, typically only used with Fresh Links */
  link: Scalars["String"]["output"];
  /**
   * Indicates the submission should override the post comment, either by
   * submitting no comment or submitting a different comment
   */
  overrideComment: Scalars["Boolean"]["output"];
  platform: Maybe<Scalars["String"]["output"]>;
  post: RedditPostType;
  postAt: Scalars["DateTime"]["output"];
  postId: Maybe<Scalars["ID"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  /** Immediately crosspost this submission to the user's profile */
  profileCrosspost: Scalars["Boolean"]["output"];
  /** How this submission is going to be published. */
  publishingMethod: PostsRedditPostSubmissionPublishingMethodChoices;
  /** The Reddit username to submit the post as. Only supported on crossposts */
  redditUsername: Scalars["String"]["output"];
  /** The date and time the submission should be removed */
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  /** The number of hours or days after the post should be removed */
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  /** The karma threshold required to remove the submission from Reddit. Only posts with karma lower than this will be removed. */
  removeMinUpvotes: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  submissionAttempts: Array<SubmissionAttemptType>;
  subreddit: Scalars["String"]["output"];
  /** Title override for the subreddit submission */
  title: Scalars["String"]["output"];
  /** The number of times we have tried submitting this post to the target */
  tries: Scalars["Int"]["output"];
};

export type RedditPostType = {
  campaign: Maybe<CampaignType>;
  campaignId: Maybe<Scalars["String"]["output"]>;
  comment: Scalars["String"]["output"];
  content: Scalars["String"]["output"];
  dateCreated: Scalars["DateTime"]["output"];
  /** The date and time the submission was soft-deleted */
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Scalars["DateTime"]["output"];
  gallery: Maybe<GalleryType>;
  id: Scalars["ID"]["output"];
  /** The ID of the Imgur image */
  imageId: Scalars["String"]["output"];
  /** Deprecated, do not use */
  imageUploadLocation: Maybe<Scalars["String"]["output"]>;
  link: Scalars["String"]["output"];
  media: Maybe<MediaType>;
  nsfw: Scalars["Boolean"]["output"];
  platform: Maybe<Scalars["String"]["output"]>;
  pollChoices: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The number of hours the poll should be open for */
  pollDuration: Maybe<Scalars["Int"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: PostsRedditPostPublishingStatusChoices;
  /** The Reddit username to submit the post as */
  redditUsername: Scalars["String"]["output"];
  sendRepliesToInbox: Scalars["Boolean"]["output"];
  /** The social account to submit the post as */
  socialAccount: SocialAccountType;
  spoiler: Scalars["Boolean"]["output"];
  submissionCount: Maybe<Scalars["Int"]["output"]>;
  submissions: Array<RedditPostSubmissionType>;
  thumbnailUrl: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  /** The user who scheduled the post */
  user: Maybe<AccountMember>;
};

export type RedditRedditorType = {
  commentKarma: Maybe<Scalars["Int"]["output"]>;
  createdAt: Maybe<Scalars["DateTime"]["output"]>;
  createdUtc: Maybe<Scalars["Int"]["output"]>;
  followers: Maybe<Scalars["Int"]["output"]>;
  iconImg: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["String"]["output"]>;
  linkKarma: Maybe<Scalars["Int"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  over18: Maybe<Scalars["Boolean"]["output"]>;
  publicDescription: Maybe<Scalars["String"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
};

/** An enumeration. */
export type RedditSubmissionPostTypeChoices =
  /** Link-post */
  | "LINK"
  /** Self-post */
  | "SELFPOST";

export type RedditSubmissionType = {
  author: Maybe<RedditRedditorType>;
  createdAt: Maybe<Scalars["DateTime"]["output"]>;
  createdUtc: Maybe<Scalars["Int"]["output"]>;
  id: Maybe<Scalars["String"]["output"]>;
  numComments: Maybe<Scalars["Int"]["output"]>;
  over18: Maybe<Scalars["Boolean"]["output"]>;
  permalink: Maybe<Scalars["String"]["output"]>;
  removedByCategory: Maybe<Scalars["String"]["output"]>;
  score: Maybe<Scalars["Int"]["output"]>;
  subreddit: Maybe<Scalars["String"]["output"]>;
  thumbnail: Maybe<Scalars["String"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
  userUpvoted: Maybe<Scalars["Boolean"]["output"]>;
};

/** Aka RedditorType */
export type RedditUserType = {
  accessToken: Maybe<Scalars["String"]["output"]>;
  /** Indicates that Postpone has a successful connection to this Reddit account */
  accountConnected: Scalars["Boolean"]["output"];
  avatarUrl: Maybe<Scalars["String"]["output"]>;
  /** Whether the account can be used to log into Postpone */
  canLogin: Scalars["Boolean"]["output"];
  commentKarma: Maybe<Scalars["Int"]["output"]>;
  countryCode: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  /** Whether the account can be used to schedule posts and send DMs */
  enabled: Scalars["Boolean"]["output"];
  followers: Maybe<Scalars["Int"]["output"]>;
  formattedUsername: Maybe<Scalars["String"]["output"]>;
  hasAccountScopeEnabled: Maybe<Scalars["Boolean"]["output"]>;
  hasDmsEnabled: Maybe<Scalars["Boolean"]["output"]>;
  hasEditEnabled: Maybe<Scalars["Boolean"]["output"]>;
  hasHistoryEnabled: Maybe<Scalars["Boolean"]["output"]>;
  hasModconfigScopeEnabled: Maybe<Scalars["Boolean"]["output"]>;
  hasModpostsScopeEnabled: Maybe<Scalars["Boolean"]["output"]>;
  hasMysubredditsEnabled: Maybe<Scalars["Boolean"]["output"]>;
  hasVerifiedEmail: Maybe<Scalars["Boolean"]["output"]>;
  hasVoteEnabled: Maybe<Scalars["Boolean"]["output"]>;
  iconImg: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  inboxCount: Maybe<Scalars["Int"]["output"]>;
  linkKarma: Maybe<Scalars["Int"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
  platform: Maybe<Scalars["String"]["output"]>;
  profileUrl: Maybe<Scalars["String"]["output"]>;
  provider: Maybe<Scalars["String"]["output"]>;
  proxyType: Maybe<Scalars["String"]["output"]>;
  refreshToken: Maybe<Scalars["String"]["output"]>;
  removedSubmissionsPercentage: Maybe<Scalars["Float"]["output"]>;
  /** The score (roughly 0-10) indicating the likelihood submissions will succeed */
  score: Scalars["Int"]["output"];
  scoreDetails: Maybe<RedditorScoreDetailsType>;
  socialAuthId: Maybe<Scalars["ID"]["output"]>;
  /** Indicates whether Postpone should sync this account's subscribed subreddits with the Subreddit Manager */
  syncSubscribedSubreddits: Scalars["Boolean"]["output"];
  uid: Maybe<Scalars["String"]["output"]>;
  username: Scalars["String"]["output"];
};

export type RedditorAnalyticsDataPointType = {
  awardeeKarma: Maybe<Scalars["Int"]["output"]>;
  awarderKarma: Maybe<Scalars["Int"]["output"]>;
  commentKarma: Maybe<Scalars["Int"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  followers: Maybe<Scalars["Int"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  linkKarma: Maybe<Scalars["Int"]["output"]>;
  score: Maybe<Scalars["Int"]["output"]>;
  startOfWeek: Maybe<Scalars["DateTime"]["output"]>;
  totalKarma: Maybe<Scalars["Int"]["output"]>;
};

export type RedditorAnalyticsType = {
  dataPoints: Maybe<Array<Maybe<RedditorAnalyticsDataPointType>>>;
};

export type RedditorScoreDetailsType = {
  accountAge: Maybe<Scalars["Int"]["output"]>;
  commentKarma: Maybe<Scalars["Int"]["output"]>;
  hasVerifiedEmail: Maybe<Scalars["Int"]["output"]>;
  linkKarma: Maybe<Scalars["Int"]["output"]>;
  removedPosts: Maybe<Scalars["Int"]["output"]>;
};

export type RemoveModAlert = {
  success: Maybe<Scalars["Boolean"]["output"]>;
};

/** An enumeration. */
export type ReplySettings = "EVERYONE" | "FOLLOWING" | "MENTIONED_USERS";

export type RetryRedditPost = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type RowValidationErrorType = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  row: Maybe<Scalars["Int"]["output"]>;
};

export type SafetyFilter = "ALL" | "NSFW" | "SFW";

export type ScheduleBlueskyPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<BlueskyPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleBlueskyPostInput = {
  allowRepliesFrom: InputMaybe<AllowRepliesFrom>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
  publishingStatus: InputMaybe<PublishingStatusType>;
  thread: Array<InputMaybe<BlueskyPostSubmissionInputType>>;
  username: Scalars["String"]["input"];
};

export type ScheduleFacebookPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<FacebookPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleFacebookPostInput = {
  gallery: InputMaybe<GalleryInput>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  publishingStatus: InputMaybe<PublishingStatusType>;
  submissions: Array<InputMaybe<FacebookPostSubmissionInputType>>;
  text: InputMaybe<Scalars["String"]["input"]>;
  username: Scalars["String"]["input"];
};

export type ScheduleInstagramPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<InstagramPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleInstagramPostInput = {
  caption: InputMaybe<Scalars["String"]["input"]>;
  collaborators: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  firstComment: InputMaybe<Scalars["String"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  publishingStatus: InputMaybe<PublishingStatusType>;
  submissions: Array<InputMaybe<InstagramPostSubmissionInputType>>;
  username: Scalars["String"]["input"];
};

export type ScheduleLinkedInPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<LinkedInPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleLinkedInPostInput = {
  gallery: InputMaybe<GalleryInput>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  link: InputMaybe<Scalars["String"]["input"]>;
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  publishingStatus: InputMaybe<PublishingStatusType>;
  submissions: Array<InputMaybe<LinkedInPostSubmissionInputType>>;
  text: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
  visibility: Visibility;
};

export type ScheduleMastodonPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<MastodonPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleMastodonPostInput = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
  publishingStatus: InputMaybe<PublishingStatusType>;
  thread: Array<InputMaybe<MastodonPostSubmissionInputType>>;
  username: Scalars["String"]["input"];
};

export type SchedulePinterestPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<PinterestPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type SchedulePinterestPostInput = {
  boardId: Scalars["String"]["input"];
  boardSectionId: InputMaybe<Scalars["String"]["input"]>;
  description: InputMaybe<Scalars["String"]["input"]>;
  dominantColor: InputMaybe<Scalars["String"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  link: InputMaybe<Scalars["String"]["input"]>;
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  note: InputMaybe<Scalars["String"]["input"]>;
  publishingStatus: InputMaybe<PublishingStatusType>;
  submissions: Array<InputMaybe<PinterestPostSubmissionInputType>>;
  title: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type ScheduleThreadsPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<ThreadsPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleThreadsPostInput = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
  publishingStatus: InputMaybe<PublishingStatusType>;
  replySettings: InputMaybe<ReplySettings>;
  thread: Array<InputMaybe<ThreadsPostSubmissionInputType>>;
  username: Scalars["String"]["input"];
};

export type ScheduleTikTokPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<TikTokPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleTikTokPostInput = {
  allowUsersToComment: Scalars["Boolean"]["input"];
  allowUsersToDuet: Scalars["Boolean"]["input"];
  allowUsersToStitch: Scalars["Boolean"]["input"];
  autoAddMusic: InputMaybe<Scalars["Boolean"]["input"]>;
  caption: InputMaybe<Scalars["String"]["input"]>;
  description: InputMaybe<Scalars["String"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  isBrandContent: Scalars["Boolean"]["input"];
  isPaidPartnership: Scalars["Boolean"]["input"];
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  privacyLevel: PrivacyLevel;
  publishingStatus: InputMaybe<PublishingStatusType>;
  submissions: Array<InputMaybe<TikTokPostSubmissionInputType>>;
  username: Scalars["String"]["input"];
};

export type ScheduleTumblrPost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<TumblrPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleTumblrPostInput = {
  communityLabel: CommunityLabel;
  /** The post content in NPF */
  content: Scalars["JSONString"]["input"];
  id: InputMaybe<Scalars["ID"]["input"]>;
  /** The post layout in NPF */
  layout: Scalars["JSONString"]["input"];
  publishingStatus: InputMaybe<PublishingStatusType>;
  sourceUrl: InputMaybe<Scalars["String"]["input"]>;
  submissions: Array<InputMaybe<TumblrPostSubmissionInputType>>;
  tags: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  username: Scalars["String"]["input"];
};

export type ScheduleTweet = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<TwitterPostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleTweetInput = {
  forSuperFollowersOnly: InputMaybe<Scalars["Boolean"]["input"]>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
  publishingStatus: InputMaybe<PublishingStatusType>;
  replySettings: InputMaybe<ReplySettings>;
  thread: Array<InputMaybe<TweetInputType>>;
  username: Scalars["String"]["input"];
};

export type ScheduleYouTubePost = {
  errors: Maybe<Array<Maybe<ValidationErrorType>>>;
  post: Maybe<YouTubePostType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type ScheduleYouTubePostInput = {
  description: InputMaybe<Scalars["String"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  madeForKids: Scalars["Boolean"]["input"];
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  privacyStatus: PrivacyStatus;
  publishingStatus: InputMaybe<PublishingStatusType>;
  submissions: Array<InputMaybe<YouTubePostSubmissionInputType>>;
  tags: InputMaybe<Array<InputMaybe<Scalars["String"]["input"]>>>;
  title: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type ScheduledPostAnalyticsType = {
  firstScheduled: Maybe<Scalars["DateTime"]["output"]>;
  lastCreated: Maybe<RedditPostType>;
  lastScheduled: Maybe<Scalars["DateTime"]["output"]>;
  nextScheduled: Maybe<Scalars["DateTime"]["output"]>;
  totalScheduled: Maybe<Scalars["Int"]["output"]>;
};

export type SecureConnectLinkType = {
  dateCreated: Scalars["DateTime"]["output"];
  expires: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  isValid: Maybe<Scalars["Boolean"]["output"]>;
  platform: UsersSecureConnectLinkPlatformChoices;
  /** The Redditor who used this link to connect their account */
  redditor: Maybe<RedditUserType>;
  /** The social account who used this link to connect their account */
  socialAccount: Maybe<SocialAccountType>;
  status: UsersSecureConnectLinkStatusChoices;
  token: Scalars["String"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
};

export type SetDefaultPostSettingsFields = {
  success: Maybe<Scalars["Boolean"]["output"]>;
  validationErrors: Maybe<Array<Maybe<ValidationErrorType>>>;
};

export type SetFrequencyWarningsEnabled = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type SocialAccountAnalyticsDataPointType = {
  date: Maybe<Scalars["DateTime"]["output"]>;
  followers: Maybe<Scalars["Int"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  startOfWeek: Maybe<Scalars["DateTime"]["output"]>;
  submissions: Maybe<Scalars["Int"]["output"]>;
};

export type SocialAccountAnalyticsType = {
  dataPoints: Maybe<Array<Maybe<SocialAccountAnalyticsDataPointType>>>;
};

export type SocialAccountCapabilitiesType = {
  createComments: Maybe<Scalars["Boolean"]["output"]>;
  createMessages: Maybe<Scalars["Boolean"]["output"]>;
  listComments: Maybe<Scalars["Boolean"]["output"]>;
  listMessages: Maybe<Scalars["Boolean"]["output"]>;
  viewAnalytics: Maybe<Scalars["Boolean"]["output"]>;
};

export type SocialAccountInputType = {
  platform: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type SocialAccountType = {
  avatarUrl: Maybe<Scalars["String"]["output"]>;
  /** Whether the account can be used to log into Postpone */
  canLogin: Scalars["Boolean"]["output"];
  capabilities: Maybe<SocialAccountCapabilitiesType>;
  /** Date the account was created on the platform */
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  description: Scalars["String"]["output"];
  followers: Scalars["Int"]["output"];
  formattedUsername: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  /** Indicates that Postpone has a valid connection to the account */
  isConnected: Scalars["Boolean"]["output"];
  /** Whether the account can be used on Postpone */
  isEnabled: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  platform: SocialaccountsSocialAccountPlatformChoices;
  /** The domain of the platform instance. Eg mastodon.social, techhub.social, etc. */
  platformDomain: Scalars["String"]["output"];
  platformFeatures: Maybe<Scalars["GenericScalar"]["output"]>;
  /** The ID of the account on the platform */
  platformId: Scalars["String"]["output"];
  postSettings: Maybe<Scalars["GenericScalar"]["output"]>;
  profile: Maybe<Scalars["JSONString"]["output"]>;
  profileUrl: Maybe<Scalars["String"]["output"]>;
  schedule: Maybe<Scalars["GenericScalar"]["output"]>;
  username: Scalars["String"]["output"];
  verified: Scalars["Boolean"]["output"];
};

/** One of the social platforms Postpone supports. */
export type SocialPlatform =
  | "BLUESKY"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "LINKEDIN"
  | "MASTODON"
  | "PINTEREST"
  | "REDDIT"
  | "THREADS"
  | "TIKTOK"
  | "TUMBLR"
  | "TWITTER"
  | "YOUTUBE";

export type SocialPostInterface = {
  account: Maybe<AccountType>;
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<SocialSubmissionInterface>>>;
};

export type SocialSubmissionErrorType = {
  /** When the error was acknowledged by the account owner */
  dateAcknowledged: Maybe<Scalars["DateTime"]["output"]>;
  dateFailed: Scalars["DateTime"]["output"];
  dateUpdated: Scalars["DateTime"]["output"];
  errorCode: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  message: Scalars["String"]["output"];
  suggestedFix: Scalars["String"]["output"];
  traceback: Scalars["String"]["output"];
};

export type SocialSubmissionInterface = {
  error: Maybe<SocialSubmissionErrorType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type SocialSubmissionResultType = {
  accountUsername: Scalars["String"]["output"];
  /** The number of comments the submission received */
  comments: Scalars["Int"]["output"];
  dateSubmitted: Scalars["DateTime"]["output"];
  /** The ID of the submission on the platform */
  externalSubmissionId: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  /** The number of likes, upvotes, or favorites the submission received */
  likes: Scalars["Int"]["output"];
  removalReason: Scalars["String"]["output"];
  removedBy: Scalars["String"]["output"];
  removedByCategory: Scalars["String"]["output"];
  status: Maybe<Scalars["String"]["output"]>;
  url: Scalars["String"]["output"];
  /** The number of views the submission received */
  views: Scalars["Int"]["output"];
};

/** An enumeration. */
export type SocialaccountsSocialAccountPlatformChoices =
  /** Bluesky */
  | "BLUESKY"
  /** Facebook */
  | "FACEBOOK"
  /** Instagram */
  | "INSTAGRAM"
  /** Linkedin */
  | "LINKEDIN"
  /** Mastodon */
  | "MASTODON"
  /** Pinterest */
  | "PINTEREST"
  /** Reddit */
  | "REDDIT"
  /** Threads */
  | "THREADS"
  /** Tiktok */
  | "TIKTOK"
  /** Tumblr */
  | "TUMBLR"
  /** Twitter */
  | "TWITTER"
  /** Youtube */
  | "YOUTUBE";

export type SortFieldType = "COMMENTS" | "DATE" | "LIKES";

export type SubmissionAttemptType = {
  authorUsername: Scalars["String"]["output"];
  dateAttempted: Scalars["DateTime"]["output"];
  errorCode: Scalars["String"]["output"];
  errorMessage: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  link: Scalars["String"]["output"];
  redditSubmissionId: Scalars["String"]["output"];
  subreddit: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
  title: Scalars["String"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
};

export type SubmissionErrorType = {
  /** When the error was acknowledged by the account owner */
  dateAcknowledged: Maybe<Scalars["DateTime"]["output"]>;
  dateFailed: Scalars["DateTime"]["output"];
  errorCode: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  message: Scalars["String"]["output"];
  suggestedFix: Maybe<Scalars["String"]["output"]>;
};

export type SubmissionInput = {
  comment: InputMaybe<Scalars["String"]["input"]>;
  /** The validation_id of the parent submission to crosspost from */
  crosspostFrom: InputMaybe<Scalars["String"]["input"]>;
  flairId: InputMaybe<Scalars["String"]["input"]>;
  id: InputMaybe<Scalars["String"]["input"]>;
  overrideComment: InputMaybe<Scalars["Boolean"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
  profileCrosspost: InputMaybe<Scalars["Boolean"]["input"]>;
  publishingMethod: InputMaybe<PublishingMethodType>;
  redditUsername: InputMaybe<Scalars["String"]["input"]>;
  /** Deprecated, use remove_at_amount and remove_at_unit instead */
  removeAt: InputMaybe<Scalars["DateTime"]["input"]>;
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinUpvotes: InputMaybe<Scalars["Int"]["input"]>;
  subreddit: Scalars["String"]["input"];
  title: InputMaybe<Scalars["String"]["input"]>;
  /** Internal ID to map response validation errors to specific submissions and link to a parent submission in crosspost_from */
  validationId: InputMaybe<Scalars["String"]["input"]>;
};

export type SubmissionResultType = {
  authorUsername: Scalars["String"]["output"];
  comments: Scalars["Int"]["output"];
  dateCreated: Scalars["DateTime"]["output"];
  dateSubmitted: Maybe<Scalars["DateTime"]["output"]>;
  id: Scalars["ID"]["output"];
  isRemoved: Maybe<Scalars["Boolean"]["output"]>;
  isRemovedByAuthor: Maybe<Scalars["Boolean"]["output"]>;
  likes: Maybe<Scalars["Int"]["output"]>;
  removedByCategory: Scalars["String"]["output"];
  /** The Reddit ID of the submission */
  submissionId: Scalars["String"]["output"];
  upvotes: Scalars["Int"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
};

export type SubmissionType = "ALL" | "ATTEMPTED" | "FAILED" | "SCHEDULED" | "SUBMITTED";

export type SubmissionsPaginatedList = {
  objects: Maybe<Array<Maybe<RedditPostSubmissionType>>>;
  total: Maybe<Scalars["Int"]["output"]>;
};

/** Submits a Reddit post to Reddit immediately. */
export type SubmitRedditPost = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

/** Submits an individual post submission to Reddit immediately. */
export type SubmitRedditSubmission = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  submissionError: Maybe<SubmissionErrorType>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type SubredditAggregates = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  subreddit: Maybe<Scalars["String"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type SubredditFlairType = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  linkFlairText: Maybe<Scalars["String"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type SubredditLabelType = {
  color: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  subredditCount: Maybe<Scalars["Int"]["output"]>;
  text: Scalars["String"]["output"];
};

/** An enumeration. */
export type SubredditManagerPermissionType = "FULL" | "NONE";

export type SubredditModeratorType = {
  isBot: Maybe<Scalars["Boolean"]["output"]>;
  isRepostBot: Maybe<Scalars["Boolean"]["output"]>;
  name: Maybe<Scalars["String"]["output"]>;
};

export type SubredditPostRequirementsType = {
  description: Maybe<Scalars["String"]["output"]>;
};

export type SubredditRuleType = {
  description: Maybe<Scalars["String"]["output"]>;
  descriptionHtml: Maybe<Scalars["String"]["output"]>;
  kind: Maybe<Scalars["String"]["output"]>;
  priority: Maybe<Scalars["Int"]["output"]>;
  shortName: Maybe<Scalars["String"]["output"]>;
  violationReason: Maybe<Scalars["String"]["output"]>;
};

export type SubredditSiteType = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  site: Maybe<Scalars["String"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type SubredditTopPostsType = {
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  bestTimeOverall: Maybe<HourlyPostType>;
  bestTimeToday: Maybe<HourlyPostType>;
  bestTimeTomorrow: Maybe<HourlyPostType>;
  id: Maybe<Scalars["String"]["output"]>;
  ngrams: Maybe<Array<Maybe<NGram>>>;
  posts: Maybe<Array<Maybe<HourlyPostType>>>;
  recommendations: Maybe<Array<Maybe<HourlyPostType>>>;
  subreddit: Maybe<Scalars["String"]["output"]>;
  topFlair: Maybe<Array<Maybe<SubredditFlairType>>>;
  topSites: Maybe<Array<Maybe<SubredditSiteType>>>;
};

export type SubredditType = {
  accountsActive: Maybe<Scalars["Int"]["output"]>;
  activeUserCount: Maybe<Scalars["Int"]["output"]>;
  allowGalleries: Maybe<Scalars["Boolean"]["output"]>;
  allowImages: Maybe<Scalars["Boolean"]["output"]>;
  allowPolls: Maybe<Scalars["Boolean"]["output"]>;
  allowVideos: Maybe<Scalars["Boolean"]["output"]>;
  canAssignLinkFlair: Maybe<Scalars["Boolean"]["output"]>;
  communityIcon: Maybe<Scalars["String"]["output"]>;
  createdUtc: Maybe<Scalars["Int"]["output"]>;
  displayName: Maybe<Scalars["String"]["output"]>;
  iconImg: Maybe<Scalars["String"]["output"]>;
  isCrosspostableSubreddit: Maybe<Scalars["Boolean"]["output"]>;
  linkFlair: Maybe<Array<Maybe<FlairType>>>;
  nsfw: Maybe<Scalars["Boolean"]["output"]>;
  over18: Maybe<Scalars["Boolean"]["output"]>;
  publicDescription: Maybe<Scalars["String"]["output"]>;
  submissionType: Maybe<Scalars["String"]["output"]>;
  subredditType: Maybe<Scalars["String"]["output"]>;
  subscribers: Maybe<Scalars["Int"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
  userSubreddit: Maybe<UserSubredditType>;
  verificationRequired: Maybe<Scalars["Boolean"]["output"]>;
};

/** An enumeration. */
export type SubredditsUserSubredditFrequencyWarningIntervalUnitChoices =
  /** Day */
  | "DAY"
  /** Hour */
  | "HOUR";

export type ThreadsAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<ThreadsSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopThreadsSubmissionType>>>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalQuotes: Maybe<Scalars["Int"]["output"]>;
  totalReplies: Maybe<Scalars["Int"]["output"]>;
  totalReposts: Maybe<Scalars["Int"]["output"]>;
  totalViews: Maybe<Scalars["Int"]["output"]>;
};

export type ThreadsPostSubmissionInputType = {
  final: InputMaybe<Scalars["Boolean"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  gifUrl: InputMaybe<Scalars["String"]["input"]>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  order: Scalars["Int"]["input"];
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinLikes: InputMaybe<Scalars["Int"]["input"]>;
  repostAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  repostAtUnit: InputMaybe<Scalars["String"]["input"]>;
  repostFromSocialAccount: InputMaybe<SocialAccountInputType>;
  repostRepeatDays: InputMaybe<Scalars["Int"]["input"]>;
  text: Scalars["String"]["input"];
};

export type ThreadsPostSubmissionType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  final: Scalars["Boolean"]["output"];
  gallery: Maybe<GalleryType>;
  /** URL of the GIF to be submitted. */
  gifUrl: Scalars["String"]["output"];
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  order: Scalars["Int"]["output"];
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  text: Scalars["String"]["output"];
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type ThreadsPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  replySettings: ThreadsThreadsPostReplySettingsChoices;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<ThreadsPostSubmissionType>>>;
};

export type ThreadsSubmissionAnalyticsDataPointType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalQuotes: Maybe<Scalars["Int"]["output"]>;
  totalReplies: Maybe<Scalars["Int"]["output"]>;
  totalReposts: Maybe<Scalars["Int"]["output"]>;
  totalViews: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type ThreadsThreadsPostReplySettingsChoices =
  /** Everyone */
  | "EVERYONE"
  /** Following */
  | "FOLLOWING"
  /** Mentioned users */
  | "MENTIONED_USERS";

export type TikTokAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<TikTokPostSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopTikTokPostSubmissionType>>>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalShares: Maybe<Scalars["Int"]["output"]>;
};

export type TikTokPostSubmissionAnalyticsDataPointType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalShares: Maybe<Scalars["Int"]["output"]>;
};

export type TikTokPostSubmissionInputType = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
};

export type TikTokPostSubmissionType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type TikTokPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  allowUsersToComment: Scalars["Boolean"]["output"];
  allowUsersToDuet: Scalars["Boolean"]["output"];
  allowUsersToStitch: Scalars["Boolean"]["output"];
  /** Whether TikTok should automatically add music to the video */
  autoAddMusic: Scalars["Boolean"]["output"];
  caption: Scalars["String"]["output"];
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  description: Scalars["String"]["output"];
  gallery: GalleryType;
  id: Maybe<Scalars["ID"]["output"]>;
  /** The video is promoting the creator's own business */
  isBrandContent: Scalars["Boolean"]["output"];
  /** The video is in paid partnership for promoting third-party business */
  isPaidPartnership: Scalars["Boolean"]["output"];
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  privacyLevel: TiktokTikTokPostPrivacyLevelChoices;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<TikTokPostSubmissionType>>>;
};

/** An enumeration. */
export type TiktokTikTokPostPrivacyLevelChoices =
  /** Followers */
  | "FOLLOWER_OF_CREATOR"
  /** Friends */
  | "MUTUAL_FOLLOW_FRIENDS"
  /** Public */
  | "PUBLIC_TO_EVERYONE"
  /** Private */
  | "SELF_ONLY";

export type TimezoneType = {
  name: Maybe<Scalars["String"]["output"]>;
  value: Maybe<Scalars["String"]["output"]>;
};

export type TopBlueskyPostSubmissionType = {
  dateSubmitted: Scalars["DateTime"]["output"];
  likes: Scalars["Int"]["output"];
  platformId: Scalars["String"]["output"];
  quotes: Scalars["Int"]["output"];
  replies: Scalars["Int"]["output"];
  reposts: Scalars["Int"]["output"];
  socialAccount: SocialAccountType;
  text: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
};

export type TopFacebookSubmissionType = {
  /** The number of clicks anywhere in your post on News Feed from the user that matched the audience targeting on it. */
  clicks: Scalars["BigInt"]["output"];
  /** The number of people who matched the audience targeting that clicked anywhere in your post on News Feed. */
  clicksUnique: Scalars["BigInt"]["output"];
  /** The number of comments on your post. */
  comments: Scalars["BigInt"]["output"];
  dateSubmitted: Scalars["DateTime"]["output"];
  /** The number of people who liked your Page and clicked anywhere in your posts. */
  engagedFan: Scalars["BigInt"]["output"];
  /**
   * The number of unique people who engaged in certain ways with your Page post,
   * for example by commenting on, liking, sharing, or clicking upon particular
   * elements of the post.
   */
  engagedUsers: Scalars["BigInt"]["output"];
  /** The number of times your Page's post entered a person's screen. */
  impressions: Scalars["BigInt"]["output"];
  /** The number of people who had your Page's post enter their screen. */
  impressionsUnique: Scalars["BigInt"]["output"];
  /** The number of likes on your post. */
  likes: Scalars["BigInt"]["output"];
  message: Maybe<Scalars["String"]["output"]>;
  platformId: Scalars["String"]["output"];
  socialAccount: SocialAccountType;
  thumbnailUrl: Scalars["String"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
  /** Total number of times your video was viewed for 3+ seconds. */
  videoViews: Scalars["BigInt"]["output"];
};

export type TopInstagramSubmissionType = {
  caption: Maybe<Scalars["String"]["output"]>;
  carouselAlbumEngagement: Maybe<Scalars["Int"]["output"]>;
  carouselAlbumImpressions: Maybe<Scalars["Int"]["output"]>;
  carouselAlbumReach: Maybe<Scalars["Int"]["output"]>;
  /** The number of comments on your post. */
  comments: Scalars["BigInt"]["output"];
  dateSubmitted: Scalars["DateTime"]["output"];
  /** The number of accounts that started following you. */
  follows: Scalars["BigInt"]["output"];
  /** Total number of times the IG Media object has been seen. */
  impressions: Scalars["BigInt"]["output"];
  /** The number of likes on your post. */
  likes: Scalars["BigInt"]["output"];
  mediaProductType: Scalars["String"]["output"];
  mediaType: Scalars["String"]["output"];
  mediaUrl: Scalars["String"]["output"];
  platformId: Scalars["String"]["output"];
  /** The number of actions people take when they visit your profile after engaging with your post. */
  profileActivity: Scalars["BigInt"]["output"];
  /** The number of times your profile was visited. */
  profileVisits: Scalars["BigInt"]["output"];
  /** Total number of unique Instagram accounts that have seen the IG Media object. */
  reach: Scalars["BigInt"]["output"];
  /** The number of shares of your post. */
  shares: Scalars["BigInt"]["output"];
  socialAccount: SocialAccountType;
  thumbnailUrl: Scalars["String"]["output"];
  /** The number of likes, saves, comments and shares on your post minus the number of unlikes, unsaves and deleted comments. */
  totalInteractions: Scalars["BigInt"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
};

export type TopLinkType = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  link: Maybe<Scalars["String"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type TopLinkedInPostSubmissionType = {
  /** The number of comments on your post. */
  comments: Scalars["BigInt"]["output"];
  dateSubmitted: Scalars["DateTime"]["output"];
  /** The number of impressions of your post. */
  impressions: Scalars["BigInt"]["output"];
  /** The number of likes on your post. */
  likes: Scalars["BigInt"]["output"];
  platformId: Scalars["String"]["output"];
  socialAccount: SocialAccountType;
  text: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
};

export type TopMastodonPostSubmissionType = {
  dateSubmitted: Scalars["DateTime"]["output"];
  likes: Scalars["Int"]["output"];
  platformId: Scalars["String"]["output"];
  replies: Scalars["Int"]["output"];
  reposts: Scalars["Int"]["output"];
  socialAccount: SocialAccountType;
  text: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
};

export type TopSiteType = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  site: Maybe<Scalars["String"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type TopSubmissionType = {
  id: Maybe<Scalars["ID"]["output"]>;
  post: Maybe<_PostType>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  result: Maybe<_ResultType>;
  subreddit: Maybe<Scalars["String"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
};

export type TopSubredditType = {
  avgComments: Maybe<Scalars["Float"]["output"]>;
  avgRemoved: Maybe<Scalars["Float"]["output"]>;
  avgUpvotes: Maybe<Scalars["Float"]["output"]>;
  subreddit: Maybe<Scalars["String"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalRemoved: Maybe<Scalars["Int"]["output"]>;
  totalUpvotes: Maybe<Scalars["Int"]["output"]>;
};

export type TopThreadsSubmissionType = {
  dateSubmitted: Scalars["DateTime"]["output"];
  /** The number of likes on your post. */
  likes: Scalars["BigInt"]["output"];
  mediaProductType: Scalars["String"]["output"];
  mediaType: Scalars["String"]["output"];
  mediaUrl: Scalars["String"]["output"];
  platformId: Scalars["String"]["output"];
  /** The number of times the post was quoted. */
  quotes: Scalars["BigInt"]["output"];
  /** The number of replies to your post. */
  replies: Scalars["BigInt"]["output"];
  /** The number of times the post was reposted. */
  reposts: Scalars["BigInt"]["output"];
  socialAccount: SocialAccountType;
  text: Maybe<Scalars["String"]["output"]>;
  thumbnailUrl: Scalars["String"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
  /** The number of times the post was viewed. */
  views: Scalars["BigInt"]["output"];
};

export type TopTikTokPostSubmissionType = {
  caption: Maybe<Scalars["String"]["output"]>;
  /** The number of comments on your post. */
  comments: Scalars["BigInt"]["output"];
  dateSubmitted: Scalars["DateTime"]["output"];
  /** The number of impressions of your post. */
  impressions: Scalars["BigInt"]["output"];
  /** The number of likes on your post. */
  likes: Scalars["BigInt"]["output"];
  platformId: Scalars["String"]["output"];
  /** The number of shares of your post. */
  shares: Scalars["BigInt"]["output"];
  socialAccount: SocialAccountType;
  url: Maybe<Scalars["String"]["output"]>;
};

export type TopTumblrPostSubmissionType = {
  dateSubmitted: Scalars["DateTime"]["output"];
  /** A combination of likes, replies, and reposts. */
  notes: Scalars["Int"]["output"];
  platformId: Scalars["String"]["output"];
  socialAccount: SocialAccountType;
  text: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
};

export type TopTweetType = {
  dateSubmitted: Maybe<Scalars["DateTime"]["output"]>;
  impressions: Maybe<Scalars["Int"]["output"]>;
  likes: Maybe<Scalars["Int"]["output"]>;
  platformId: Maybe<Scalars["ID"]["output"]>;
  posts: Maybe<Scalars["Int"]["output"]>;
  quoteTweets: Maybe<Scalars["Int"]["output"]>;
  replies: Maybe<Scalars["Int"]["output"]>;
  retweets: Maybe<Scalars["Int"]["output"]>;
  socialAccount: Maybe<SocialAccountType>;
  text: Maybe<Scalars["String"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
  urlLinkClicks: Maybe<Scalars["Int"]["output"]>;
  userProfileClicks: Maybe<Scalars["Int"]["output"]>;
};

export type TopYouTubePostSubmissionType = {
  /** The number of comments on your post. */
  comments: Scalars["BigInt"]["output"];
  dateSubmitted: Scalars["DateTime"]["output"];
  /** The number of dislikes on your post. */
  dislikes: Scalars["BigInt"]["output"];
  /** The number of favorites of your post. */
  favorites: Scalars["BigInt"]["output"];
  /** The number of likes on your post. */
  likes: Scalars["BigInt"]["output"];
  platformId: Scalars["String"]["output"];
  socialAccount: SocialAccountType;
  thumbnailUrl: Scalars["String"]["output"];
  title: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
  /** The number of views of your post. */
  views: Scalars["BigInt"]["output"];
};

export type TumblrAnalyticsType = {
  avgNotes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<TumblrPostSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopTumblrPostSubmissionType>>>;
  totalNotes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
};

export type TumblrPostSubmissionAnalyticsDataPointType = {
  avgNotes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalNotes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
};

export type TumblrPostSubmissionInputType = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
};

export type TumblrPostSubmissionType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type TumblrPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  communityLabel: TumblrTumblrPostCommunityLabelChoices;
  /** The post content in NPF (https://www.tumblr.com/docs/npf) */
  content: Scalars["JSONString"]["output"];
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  /** Media that this post references in the npf_content. Used for cascade deletes. */
  gallery: Maybe<GalleryType>;
  id: Maybe<Scalars["ID"]["output"]>;
  /** The post layout in NPF (https://www.tumblr.com/docs/npf) */
  layout: Scalars["JSONString"]["output"];
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  /** A source attribution for the post content. */
  sourceUrl: Scalars["String"]["output"];
  submissions: Maybe<Array<Maybe<TumblrPostSubmissionType>>>;
  tags: Array<Scalars["String"]["output"]>;
};

/** An enumeration. */
export type TumblrTumblrPostCommunityLabelChoices =
  /** Drugs & alcohol addiction */
  | "DRUGS"
  /** For everyone */
  | "FOR_EVERYONE"
  /** Mature */
  | "MATURE"
  /** Sexual themes */
  | "SEXUAL_THEMES"
  /** Violence */
  | "VIOLENCE";

export type TweetAnalyticsDataPointType = {
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalQuoteTweets: Maybe<Scalars["Int"]["output"]>;
  totalReplies: Maybe<Scalars["Int"]["output"]>;
  totalRetweets: Maybe<Scalars["Int"]["output"]>;
  totalUrlLinkClicks: Maybe<Scalars["Int"]["output"]>;
  totalUserProfileClicks: Maybe<Scalars["Int"]["output"]>;
};

export type TweetInputType = {
  final: InputMaybe<Scalars["Boolean"]["input"]>;
  gallery: InputMaybe<GalleryInput>;
  gifUrl: InputMaybe<Scalars["String"]["input"]>;
  id: InputMaybe<Scalars["ID"]["input"]>;
  /** Name of a file in the account's Content Library. Postpone will use the first matching file. Case-insensitive. */
  mediaName: InputMaybe<Scalars["String"]["input"]>;
  /** URL of a file to be used in the post. The file will be added to your Content Library. */
  mediaUrl: InputMaybe<Scalars["String"]["input"]>;
  order: Scalars["Int"]["input"];
  poll: InputMaybe<PollInputType>;
  removeAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  removeAtUnit: InputMaybe<Scalars["String"]["input"]>;
  removeMinLikes: InputMaybe<Scalars["Int"]["input"]>;
  repostAtAmount: InputMaybe<Scalars["Int"]["input"]>;
  repostAtUnit: InputMaybe<Scalars["String"]["input"]>;
  repostFromSocialAccount: InputMaybe<SocialAccountInputType>;
  repostRepeatDays: InputMaybe<Scalars["Int"]["input"]>;
  text: Scalars["String"]["input"];
};

export type TweetType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  final: Scalars["Boolean"]["output"];
  gallery: Maybe<GalleryType>;
  /** URL of the GIF to be submitted. */
  gifUrl: Scalars["String"]["output"];
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  order: Scalars["Int"]["output"];
  platform: Maybe<Scalars["String"]["output"]>;
  poll: Maybe<PollType>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  text: Scalars["String"]["output"];
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type TwitterAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<TweetAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopTweetType>>>;
  totalImpressions: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalQuoteTweets: Maybe<Scalars["Int"]["output"]>;
  totalReplies: Maybe<Scalars["Int"]["output"]>;
  totalRetweets: Maybe<Scalars["Int"]["output"]>;
  totalUrlLinkClicks: Maybe<Scalars["Int"]["output"]>;
  totalUserProfileClicks: Maybe<Scalars["Int"]["output"]>;
};

export type TwitterPostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  replySettings: TwitterTwitterPostReplySettingsChoices;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<TweetType>>>;
};

/** An enumeration. */
export type TwitterTwitterPostReplySettingsChoices =
  /** Everyone */
  | "EVERYONE"
  /** Following */
  | "FOLLOWING"
  /** Mentioned users */
  | "MENTIONED_USERS";

export type UpdateDefaultPostSettings = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type UpdateRedditPostSubmissionPostAt = {
  errors: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  success: Maybe<Scalars["Boolean"]["output"]>;
};

export type UserSubredditType = {
  defaultComment: Scalars["String"]["output"];
  defaultFlairId: Scalars["String"]["output"];
  /** The number of hours or days after the post should be removed */
  defaultRemoveAtAmount: Maybe<Scalars["Int"]["output"]>;
  defaultRemoveAtUnit: Maybe<Scalars["String"]["output"]>;
  /** The karma threshold required to remove the submission from Reddit. Only posts with karma lower than this will be removed. */
  defaultRemoveMinUpvotes: Maybe<Scalars["Int"]["output"]>;
  favorite: Scalars["Boolean"]["output"];
  firstScheduledPostDate: Maybe<Scalars["DateTime"]["output"]>;
  firstSubmittedPostDate: Maybe<Scalars["DateTime"]["output"]>;
  flag: Scalars["Boolean"]["output"];
  frequencyWarningIntervalAmount: Scalars["Int"]["output"];
  frequencyWarningIntervalUnit: SubredditsUserSubredditFrequencyWarningIntervalUnitChoices;
  hasFrequencyWarning: Scalars["Boolean"]["output"];
  id: Scalars["ID"]["output"];
  labels: Array<SubredditLabelType>;
  lastScheduledPostDate: Maybe<Scalars["DateTime"]["output"]>;
  lastScheduledSubmission: Maybe<RedditPostSubmissionType>;
  lastSubmittedPostDate: Maybe<Scalars["DateTime"]["output"]>;
  notes: Scalars["String"]["output"];
  overrideComment: Scalars["Boolean"]["output"];
  schedule: Maybe<Scalars["GenericScalar"]["output"]>;
  scheduledPostCount: Maybe<Scalars["Int"]["output"]>;
  scheduledSubmissions: Maybe<Array<Maybe<RedditPostSubmissionType>>>;
  submittedPostCount: Maybe<Scalars["Int"]["output"]>;
  subreddit: Maybe<InternalSubredditType>;
  /** A prefix to add to the title of all posts made by this user in this subreddit */
  titlePrefix: Scalars["String"]["output"];
  /** A suffix to add to the title of all posts made by this user in this subreddit */
  titleSuffix: Scalars["String"]["output"];
  verificationStatus: Maybe<Scalars["String"]["output"]>;
  verificationStatuses: Maybe<Scalars["GenericScalar"]["output"]>;
};

/** User type object */
export type UserType = {
  account: Maybe<AccountType>;
  apiToken: Scalars["String"]["output"];
  canAccessAnalytics: Maybe<Scalars["Boolean"]["output"]>;
  canAccessDefaultPostSettings: Maybe<Scalars["Boolean"]["output"]>;
  canAccessSettingsContentHosts: Maybe<Scalars["Boolean"]["output"]>;
  canAccessSettingsCustomSchedules: Maybe<Scalars["Boolean"]["output"]>;
  canAccessSettingsDataExport: Maybe<Scalars["Boolean"]["output"]>;
  canAccessSettingsIpProxies: Maybe<Scalars["Boolean"]["output"]>;
  canConnectSocialAccounts: Maybe<Scalars["Boolean"]["output"]>;
  canManageAllSocialAccounts: Maybe<Scalars["Boolean"]["output"]>;
  canManageMembers: Maybe<Scalars["Boolean"]["output"]>;
  contentPermission: Maybe<ContentPermissionType>;
  /** The confirmed, in-force email. This is only set if the user goes through the email confirmation process. */
  email: Maybe<Scalars["String"]["output"]>;
  fullName: Scalars["String"]["output"];
  hasGoogleSso: Maybe<Scalars["Boolean"]["output"]>;
  hashedId: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  imgurAccessToken: Maybe<Scalars["String"]["output"]>;
  imgurAccountId: Maybe<Scalars["Int"]["output"]>;
  imgurAccountUsername: Maybe<Scalars["String"]["output"]>;
  inboxPermission: Maybe<InboxPermissionType>;
  isImpersonating: Maybe<Scalars["Boolean"]["output"]>;
  notifyOnEmptyPostQueue: Scalars["Boolean"]["output"];
  notifyOnSubmissionFailed: Scalars["Boolean"]["output"];
  onboardingAddedEmail: Scalars["Boolean"]["output"];
  onboardingAnalyzedSubreddit: Scalars["Boolean"]["output"];
  onboardingComplete: Maybe<Scalars["Boolean"]["output"]>;
  onboardingConnectedRedditAccount: Scalars["Boolean"]["output"];
  onboardingCreatedCampaign: Scalars["Boolean"]["output"];
  onboardingCrossposted: Scalars["Boolean"]["output"];
  onboardingScheduledPost: Scalars["Boolean"]["output"];
  onboardingUploadedToContentLibrary: Scalars["Boolean"]["output"];
  onboardingUsedSubredditManager: Scalars["Boolean"]["output"];
  onboardingViewedPostAnalytics: Scalars["Boolean"]["output"];
  /** An email that is pending confirmation. */
  pendingEmail: Scalars["String"]["output"];
  postSettings: Maybe<DefaultPostSettingsType>;
  preferences: Maybe<Scalars["GenericScalar"]["output"]>;
  redditAccounts: Maybe<Array<Maybe<RedditUserType>>>;
  registeredAt: Scalars["DateTime"]["output"];
  remainingMonthlyPosts: Maybe<Scalars["Int"]["output"]>;
  reportsFrequency: Maybe<Scalars["String"]["output"]>;
  sendEmailNotifications: Scalars["Boolean"]["output"];
  sendRedditDmNotifications: Scalars["Boolean"]["output"];
  /** The method the user used to sign up */
  signupMethod: Scalars["String"]["output"];
  socialAccounts: Maybe<Array<Maybe<SocialAccountType>>>;
  submitsNsfw: Scalars["Boolean"]["output"];
  subredditManagerPermission: Maybe<SubredditManagerPermissionType>;
  timezone: Maybe<Scalars["String"]["output"]>;
  username: Scalars["String"]["output"];
  weekStart: Maybe<Scalars["Int"]["output"]>;
};

/** An enumeration. */
export type UsersSecureConnectLinkPlatformChoices =
  /** Bluesky */
  | "BLUESKY"
  /** Facebook */
  | "FACEBOOK"
  /** Instagram */
  | "INSTAGRAM"
  /** LinkedIn */
  | "LINKEDIN"
  /** Mastodon */
  | "MASTODON"
  /** Pinterest */
  | "PINTEREST"
  /** Reddit */
  | "REDDIT"
  /** Threads */
  | "THREADS"
  /** TikTok */
  | "TIKTOK"
  /** Tumblr */
  | "TUMBLR"
  /** Twitter */
  | "TWITTER"
  /** YouTube */
  | "YOUTUBE";

/** An enumeration. */
export type UsersSecureConnectLinkStatusChoices =
  /** Expired */
  | "EXPIRED"
  /** Pending */
  | "PENDING"
  /** Revoked */
  | "REVOKED"
  /** Used */
  | "USED";

export type ValidationErrorType = {
  code: Maybe<Scalars["String"]["output"]>;
  field: Maybe<Scalars["String"]["output"]>;
  message: Maybe<Scalars["String"]["output"]>;
  params: Maybe<Scalars["GenericScalar"]["output"]>;
};

/** An enumeration. */
export type Visibility = "CONNECTIONS" | "LOGGED_IN" | "PUBLIC";

export type YouTubeAnalyticsType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  dataPoints: Maybe<Array<Maybe<YouTubePostSubmissionAnalyticsDataPointType>>>;
  topSubmissions: Maybe<Array<Maybe<TopYouTubePostSubmissionType>>>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalDislikes: Maybe<Scalars["Int"]["output"]>;
  totalFavorites: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalViews: Maybe<Scalars["Int"]["output"]>;
};

export type YouTubePostSubmissionAnalyticsDataPointType = {
  avgLikes: Maybe<Scalars["Float"]["output"]>;
  date: Maybe<Scalars["DateTime"]["output"]>;
  isoWeek: Maybe<Scalars["Int"]["output"]>;
  isoYear: Maybe<Scalars["Int"]["output"]>;
  totalComments: Maybe<Scalars["Int"]["output"]>;
  totalDislikes: Maybe<Scalars["Int"]["output"]>;
  totalFavorites: Maybe<Scalars["Int"]["output"]>;
  totalLikes: Maybe<Scalars["Int"]["output"]>;
  totalPosts: Maybe<Scalars["Int"]["output"]>;
  totalViews: Maybe<Scalars["Int"]["output"]>;
};

export type YouTubePostSubmissionInputType = {
  id: InputMaybe<Scalars["ID"]["input"]>;
  postAt: Scalars["DateTime"]["input"];
};

export type YouTubePostSubmissionType = SocialSubmissionInterface & {
  error: Maybe<SocialSubmissionErrorType>;
  globalId: Maybe<Scalars["ID"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  isGallery: Maybe<Scalars["Boolean"]["output"]>;
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  postAt: Maybe<Scalars["DateTime"]["output"]>;
  postId: Maybe<Scalars["ID"]["output"]>;
  /** Preview of the post */
  preview: Maybe<Scalars["String"]["output"]>;
  publishingStatus: Maybe<PublishingStatusType>;
  removeAt: Maybe<Scalars["DateTime"]["output"]>;
  removeAtAmount: Maybe<Scalars["Int"]["output"]>;
  removeAtUnit: Maybe<Scalars["String"]["output"]>;
  removeMinLikes: Maybe<Scalars["Int"]["output"]>;
  repostAt: Maybe<Scalars["DateTime"]["output"]>;
  repostAtAmount: Maybe<Scalars["Int"]["output"]>;
  repostAtUnit: Maybe<Scalars["String"]["output"]>;
  repostFromSocialAccount: Maybe<SocialAccountType>;
  repostRepeatDays: Maybe<Scalars["Int"]["output"]>;
  result: Maybe<SocialSubmissionResultType>;
  socialAccount: Maybe<SocialAccountType>;
  target: Maybe<Scalars["String"]["output"]>;
  /** A URL the post links to */
  url: Maybe<Scalars["String"]["output"]>;
};

export type YouTubePostType = SocialPostInterface & {
  account: Maybe<AccountType>;
  categoryId: Scalars["String"]["output"];
  createdHow: Maybe<Scalars["String"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  dateDeleted: Maybe<Scalars["DateTime"]["output"]>;
  dateUpdated: Maybe<Scalars["DateTime"]["output"]>;
  description: Scalars["String"]["output"];
  gallery: GalleryType;
  id: Maybe<Scalars["ID"]["output"]>;
  language: Scalars["String"]["output"];
  madeForKids: Scalars["Boolean"]["output"];
  media: Maybe<MediaType>;
  platform: Maybe<Scalars["String"]["output"]>;
  preview: Maybe<Scalars["String"]["output"]>;
  privacyStatus: YoutubeYouTubePostPrivacyStatusChoices;
  publishingStatus: Maybe<PublishingStatusType>;
  socialAccount: Maybe<SocialAccountType>;
  submissions: Maybe<Array<Maybe<YouTubePostSubmissionType>>>;
  tags: Array<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

/** An enumeration. */
export type YoutubeYouTubePostPrivacyStatusChoices =
  /** Private */
  | "PRIVATE"
  /** Public */
  | "PUBLIC"
  /** Unlisted */
  | "UNLISTED";

export type _PostType = {
  redditUsername: Maybe<Scalars["String"]["output"]>;
  title: Maybe<Scalars["String"]["output"]>;
};

export type _ResultType = {
  comments: Maybe<Scalars["Int"]["output"]>;
  dateCreated: Maybe<Scalars["DateTime"]["output"]>;
  upvotes: Maybe<Scalars["Int"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
};

export type FindRedgifsUrlQueryVariables = Exact<{
  filename: Scalars["String"]["input"];
}>;

export type FindRedgifsUrlQuery = {
  media: { objects: Array<{ name: string; hostedUrl: string } | null> | null } | null;
};

export type ScheduleBlueskyPostMutationVariables = Exact<{
  input: ScheduleBlueskyPostInput;
}>;

export type ScheduleBlueskyPostMutation = {
  scheduleBlueskyPost: {
    success: boolean | null;
    errors: Array<{ message: string | null } | null> | null;
  } | null;
};
