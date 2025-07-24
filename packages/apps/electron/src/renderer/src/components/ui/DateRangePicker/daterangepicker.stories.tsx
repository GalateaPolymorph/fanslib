import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { type DateRange } from "react-day-picker";
import { DateRangePicker } from "./index";

const meta: Meta<typeof DateRangePicker> = {
  title: "UI/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: { type: "text" },
      description: "Placeholder text when no date range is selected",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Select Date Range</h3>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>
        {dateRange && (
          <div className="text-sm text-muted-foreground">
            {dateRange.from && <p>From: {dateRange.from.toLocaleDateString()}</p>}
            {dateRange.to && <p>To: {dateRange.to.toLocaleDateString()}</p>}
          </div>
        )}
      </div>
    );
  },
};

export const WithInitialRange: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      from: new Date(),
      to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Date Range with Initial Values</h3>
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        </div>
        <div className="text-sm text-muted-foreground">
          {dateRange?.from && <p>From: {dateRange.from.toLocaleDateString()}</p>}
          {dateRange?.to && <p>To: {dateRange.to.toLocaleDateString()}</p>}
        </div>
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Custom Placeholder</h3>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            placeholder="Select vacation dates"
          />
        </div>
        {dateRange && (
          <div className="text-sm text-muted-foreground">
            {dateRange.from && <p>Vacation starts: {dateRange.from.toLocaleDateString()}</p>}
            {dateRange.to && <p>Vacation ends: {dateRange.to.toLocaleDateString()}</p>}
          </div>
        )}
      </div>
    );
  },
};

export const EventPlanning: Story = {
  render: () => {
    const [eventRange, setEventRange] = useState<DateRange | undefined>();
    const [promotionRange, setPromotionRange] = useState<DateRange | undefined>();

    const eventDuration =
      eventRange?.from && eventRange?.to
        ? Math.ceil((eventRange.to.getTime() - eventRange.from.getTime()) / (1000 * 60 * 60 * 24)) +
          1
        : null;

    return (
      <div className="w-[500px] space-y-6">
        <h3 className="text-lg font-semibold">Event Planning</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Event Duration</label>
          <DateRangePicker
            dateRange={eventRange}
            onDateRangeChange={setEventRange}
            placeholder="Select event dates"
          />
          <p className="text-xs text-muted-foreground">When will your event take place?</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Promotion Period</label>
          <DateRangePicker
            dateRange={promotionRange}
            onDateRangeChange={setPromotionRange}
            placeholder="Select promotion dates"
          />
          <p className="text-xs text-muted-foreground">When should we promote this event?</p>
        </div>

        {(eventRange || promotionRange) && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Planning Summary:</h4>
            <div className="space-y-1 text-sm text-blue-800">
              {eventRange?.from && eventRange?.to && (
                <p>
                  📅 Event: {eventRange.from.toLocaleDateString()} -{" "}
                  {eventRange.to.toLocaleDateString()} ({eventDuration} days)
                </p>
              )}
              {promotionRange?.from && promotionRange?.to && (
                <p>
                  📢 Promotion: {promotionRange.from.toLocaleDateString()} -{" "}
                  {promotionRange.to.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const ReportingPeriod: Story = {
  render: () => {
    const [reportRange, setReportRange] = useState<DateRange | undefined>();
    const [comparisonRange, setComparisonRange] = useState<DateRange | undefined>();

    return (
      <div className="w-[500px] space-y-6">
        <h3 className="text-lg font-semibold">Analytics Reporting</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Period</label>
          <DateRangePicker
            dateRange={reportRange}
            onDateRangeChange={setReportRange}
            placeholder="Select reporting period"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Comparison Period</label>
          <DateRangePicker
            dateRange={comparisonRange}
            onDateRangeChange={setComparisonRange}
            placeholder="Select comparison period"
          />
        </div>

        {(reportRange || comparisonRange) && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">Report Configuration:</h4>
            <div className="space-y-1 text-sm text-green-800">
              {reportRange?.from && reportRange?.to && (
                <p>
                  📊 Primary: {reportRange.from.toLocaleDateString()} -{" "}
                  {reportRange.to.toLocaleDateString()}
                </p>
              )}
              {comparisonRange?.from && comparisonRange?.to && (
                <p>
                  📈 Compare: {comparisonRange.from.toLocaleDateString()} -{" "}
                  {comparisonRange.to.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const ContentScheduling: Story = {
  render: () => {
    const [postingRange, setPostingRange] = useState<DateRange | undefined>();
    const [campaignRange, setCampaignRange] = useState<DateRange | undefined>();

    return (
      <div className="w-[500px] space-y-6">
        <h3 className="text-lg font-semibold">Content Campaign</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Posting Schedule</label>
          <DateRangePicker
            dateRange={postingRange}
            onDateRangeChange={setPostingRange}
            placeholder="When to post content"
          />
          <p className="text-xs text-muted-foreground">Daily posting period for this campaign</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Campaign Duration</label>
          <DateRangePicker
            dateRange={campaignRange}
            onDateRangeChange={setCampaignRange}
            placeholder="Campaign lifespan"
          />
          <p className="text-xs text-muted-foreground">
            Overall campaign duration including prep and follow-up
          </p>
        </div>

        {(postingRange || campaignRange) && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 mb-2">Campaign Plan:</h4>
            <div className="space-y-1 text-sm text-purple-800">
              {campaignRange?.from && campaignRange?.to && (
                <p>
                  🎯 Campaign: {campaignRange.from.toLocaleDateString()} -{" "}
                  {campaignRange.to.toLocaleDateString()}
                </p>
              )}
              {postingRange?.from && postingRange?.to && (
                <p>
                  📝 Posting: {postingRange.from.toLocaleDateString()} -{" "}
                  {postingRange.to.toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const CustomWidth: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Custom Width</h3>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-[400px]"
            placeholder="Wider date range picker"
          />
        </div>
      </div>
    );
  },
};
