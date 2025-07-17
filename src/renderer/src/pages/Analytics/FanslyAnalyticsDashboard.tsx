import { PageContainer } from "@renderer/components/ui/PageContainer/PageContainer";
import { PageHeader } from "@renderer/components/ui/PageHeader/PageHeader";
import { TimeframeSelector } from "../../components/Analytics/TimeframeSelector";
import { AnalyticsProvider } from "../../contexts/AnalyticsContext";
import { FanslyAnalyticsGrid } from "./FanslyAnalyticsGrid";

export const FanslyAnalyticsDashboard = () => {
  return (
    <AnalyticsProvider>
      <PageContainer spacing="lg">
        <PageHeader
          title="Fansly Analytics Dashboard"
          titleSize="lg"
          description="Track your content performance and engagement metrics"
        />
        <div className="space-y-6">
          <TimeframeSelector />
          <FanslyAnalyticsGrid />
        </div>
      </PageContainer>
    </AnalyticsProvider>
  );
};
