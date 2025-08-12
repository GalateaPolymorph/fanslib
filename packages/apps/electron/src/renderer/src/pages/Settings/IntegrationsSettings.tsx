import { Tabs } from "@renderer/components/ui/Tabs";
import { Zap } from "lucide-react";
import { FanslySettings } from "./FanslySettings";
import { PostponeSettings } from "./PostponeSettings";
import { RedditSettings } from "./RedditSettings";

export const IntegrationsSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Zap /> Integrations
        </h1>
        <p className="text-muted-foreground">Connect with external services and APIs</p>
      </div>

      <Tabs
        items={[
          {
            id: "fansly",
            label: "Fansly",
            content: <FanslySettings />,
          },
          {
            id: "postpone",
            label: "Postpone",
            content: <PostponeSettings />,
          },
          {
            id: "reddit",
            label: "Reddit",
            content: <RedditSettings />,
          },
        ]}
      />
    </div>
  );
};
