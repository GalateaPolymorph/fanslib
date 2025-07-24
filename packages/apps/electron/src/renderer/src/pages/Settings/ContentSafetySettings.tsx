import { Shield } from "lucide-react";
import { SfwModeSettings } from "./SfwModeSettings";

export const ContentSafetySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Shield /> Content Safety
        </h1>
        <p className="text-muted-foreground">Control content visibility and filtering options</p>
      </div>

      <div className="space-y-2">
        <SfwModeSettings />
      </div>
    </div>
  );
};
