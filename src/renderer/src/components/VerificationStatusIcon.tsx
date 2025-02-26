import {
  CheckCircle2Icon,
  CircleDotIcon,
  HelpCircleIcon,
  SearchIcon,
  ShieldXIcon,
  XCircleIcon,
} from "lucide-react";
import { VERIFICATION_STATUS, type VerificationStatus } from "../../../features/channels/type";

export const verificationStatusIconMap = {
  [VERIFICATION_STATUS.NOT_NEEDED]: CircleDotIcon,
  [VERIFICATION_STATUS.VERIFIED]: CheckCircle2Icon,
  [VERIFICATION_STATUS.NEEDED]: XCircleIcon,
  [VERIFICATION_STATUS.APPLIED]: SearchIcon,
  [VERIFICATION_STATUS.REJECTED]: ShieldXIcon,
  [VERIFICATION_STATUS.UNKNOWN]: HelpCircleIcon,
};

export const VerificationStatusIcon = ({ status }: { status: VerificationStatus }) => {
  const Icon = verificationStatusIconMap[status];
  if (!Icon) return null;
  return <Icon className="w-4 h-4" />;
};
