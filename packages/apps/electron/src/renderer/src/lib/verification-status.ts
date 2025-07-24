import { VERIFICATION_STATUS, type VerificationStatus } from "../../../features/channels/type";

const VERIFICATION_STATUS_MAP = {
  [VERIFICATION_STATUS.NOT_NEEDED]: "Not Needed",
  [VERIFICATION_STATUS.VERIFIED]: "Verified",
  [VERIFICATION_STATUS.NEEDED]: "Needed",
  [VERIFICATION_STATUS.APPLIED]: "Applied",
  [VERIFICATION_STATUS.REJECTED]: "Rejected",
  [VERIFICATION_STATUS.UNKNOWN]: "Unknown",
};

export const formatVerificationStatus = (status: VerificationStatus) => {
  return VERIFICATION_STATUS_MAP[status];
};
