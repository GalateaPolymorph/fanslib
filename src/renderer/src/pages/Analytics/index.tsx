import { Separator } from "@renderer/components/ui/separator";

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">View insights and statistics about your content performance.</p>
      </div>

      <Separator />

      <div className="space-y-16">
        <div className="flex items-center justify-center h-96 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Analytics content will appear here.</p>
        </div>
      </div>
    </div>
  );
};