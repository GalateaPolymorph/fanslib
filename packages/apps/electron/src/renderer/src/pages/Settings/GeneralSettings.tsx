import { Settings2 } from "lucide-react";
import { LibraryPathInput } from "./LibraryPathInput";
import { SettingRow } from "./SettingRow";

export const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Settings2 /> General
        </h1>
        <p className="text-muted-foreground">Configure basic application preferences</p>
      </div>

      <div className="space-y-2">
        <SettingRow
          title="Library Path"
          description="Select the folder where your media files are stored. This will be used to organize and manage your content library."
        >
          <LibraryPathInput />
        </SettingRow>
      </div>
    </div>
  );
};
