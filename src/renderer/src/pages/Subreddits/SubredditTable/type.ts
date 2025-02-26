import { VerificationStatus } from "src/features/channels/type";

export type EditingSubreddit = {
  id: string;
  name: string;
  maxPostFrequencyHours?: number;
  notes?: string;
  memberCount?: number;
  verificationStatus: VerificationStatus;
};
