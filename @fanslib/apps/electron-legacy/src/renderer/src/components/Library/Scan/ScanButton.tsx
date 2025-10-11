import { RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";

type ScanButtonProps = {
  isScanning: boolean;
  onScan: () => Promise<void>;
};

export const ScanButton = ({ isScanning, onScan }: ScanButtonProps) => (
  <Button
    variant="outline"
    onClick={onScan}
    disabled={isScanning}
    className="flex items-center gap-2"
  >
    <RefreshCw className={cn("h-4 w-4", isScanning && "animate-spin")} />
    {isScanning ? "Scanning..." : "Scan Library"}
  </Button>
);
