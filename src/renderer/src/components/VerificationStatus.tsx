import { cn } from "@renderer/lib/utils";
import { formatVerificationStatus } from "@renderer/lib/verification-status";
import {
  VERIFICATION_STATUS,
  type VerificationStatus as VerificationStatusType,
} from "../../../features/channels/type";
import { VerificationStatusIcon } from "./VerificationStatusIcon";

type VerificationStatusProps = {
  status: VerificationStatusType;
  className?: string;
};

const verificationStatusColor = {
  [VERIFICATION_STATUS.UNKNOWN]: "text-muted-foreground",
  [VERIFICATION_STATUS.NOT_NEEDED]: "text-blue-500",
  [VERIFICATION_STATUS.NEEDED]: "text-yellow-500",
  [VERIFICATION_STATUS.APPLIED]: "text-orange-500",
  [VERIFICATION_STATUS.REJECTED]: "text-red-500",
  [VERIFICATION_STATUS.VERIFIED]: "text-green-500",
} as const;

export const VerificationStatus = ({ status, className }: VerificationStatusProps) => {
  const color = verificationStatusColor[status];

  return (
    <div className={cn("flex items-center gap-1", color, className)}>
      <VerificationStatusIcon status={status} />
      <span>{formatVerificationStatus(status)}</span>
    </div>
  );
};
