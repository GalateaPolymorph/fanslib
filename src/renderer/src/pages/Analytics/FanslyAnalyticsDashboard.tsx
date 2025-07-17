import { PageContainer } from "@renderer/components/ui/PageContainer/PageContainer";
import { PageHeader } from "@renderer/components/ui/PageHeader/PageHeader";
import { AnalyticsProvider } from "../../contexts/AnalyticsContext";
import { FanslyAnalyticsDashboardActions } from "./FanslyAnalyticsDashboardActions";
import { FanslyAnalyticsGrid } from "./FanslyAnalyticsGrid";
import { TimeframeSelector } from "./TimeframeSelector";

export const FanslyAnalyticsDashboard = () => {
  return (
    <AnalyticsProvider>
      <PageContainer spacing="lg">
        <PageHeader
          title="Fansly Analytics Dashboard"
          titleSize="lg"
          description="Track your content performance and engagement metrics"
          actions={<FanslyAnalyticsDashboardActions />}
        />
        <div className="space-y-6">
          <TimeframeSelector />
          <FanslyAnalyticsGrid />
        </div>
      </PageContainer>
    </AnalyticsProvider>
  );
};
