import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/Tabs";
import { Zap } from "lucide-react";
import { FanslySettings } from "./FanslySettings";
import { PostponeSettings } from "./PostponeSettings";

export const IntegrationsSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Zap /> Integrations
        </h1>
        <p className="text-muted-foreground">Connect with external services and APIs</p>
      </div>

      <Tabs defaultValue="fansly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fansly">Fansly Analytics</TabsTrigger>
          <TabsTrigger value="postpone">Postpone</TabsTrigger>
        </TabsList>

        <TabsContent value="fansly" className="space-y-6">
          <FanslySettings />
        </TabsContent>

        <TabsContent value="postpone" className="space-y-6">
          <PostponeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
