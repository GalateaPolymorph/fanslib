import { VerificationStatus } from "src/features/channels/type";
import type { MediaFilters } from "src/features/library/api-type";

export type EditingSubreddit = {
  id: string;
  name: string;
  maxPostFrequencyHours?: number;
  notes?: string;
  memberCount?: number;
  verificationStatus: VerificationStatus;
  eligibleMediaFilter?: MediaFilters;
};
