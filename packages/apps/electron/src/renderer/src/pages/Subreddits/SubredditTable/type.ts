import { VerificationStatus } from "src/features/channels/type";
import type { MediaFilters } from "src/features/library/api-type";
import type { SubredditPostingTime } from "src/features/channels/api-type";

export type EditingSubreddit = {
  id: string;
  name: string;
  maxPostFrequencyHours?: number;
  notes?: string;
  memberCount?: number;
  verificationStatus: VerificationStatus;
  eligibleMediaFilter?: MediaFilters;
  defaultFlair?: string;
  captionPrefix?: string;
  postingTimesData?: SubredditPostingTime[];
  postingTimesLastFetched?: Date;
  postingTimesTimezone?: string;
};
