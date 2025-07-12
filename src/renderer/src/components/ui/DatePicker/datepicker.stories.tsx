import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "./index";

const meta: Meta<typeof DatePicker> = {
  title: "UI/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: { type: "text" },
      description: "Placeholder text when no date is selected",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Select a Date</h3>
          <DatePicker date={date} setDate={setDate} />
        </div>
        {date && (
          <p className="text-sm text-muted-foreground">Selected: {date.toLocaleDateString()}</p>
        )}
      </div>
    );
  },
};

export const WithInitialDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Date Picker with Initial Date</h3>
          <DatePicker date={date} setDate={setDate} />
        </div>
        <p className="text-sm text-muted-foreground">
          Current: {date?.toLocaleDateString() || "No date selected"}
        </p>
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Custom Placeholder</h3>
          <DatePicker date={date} setDate={setDate} placeholder="Choose your birthday" />
        </div>
        {date && (
          <p className="text-sm text-muted-foreground">Birthday: {date.toLocaleDateString()}</p>
        )}
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [birthDate, setBirthDate] = useState<Date | undefined>();

    return (
      <div className="w-[400px] space-y-6">
        <h3 className="text-lg font-semibold">Event Planning Form</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Event Start Date</label>
          <DatePicker date={startDate} setDate={setStartDate} placeholder="Select start date" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Event End Date</label>
          <DatePicker date={endDate} setDate={setEndDate} placeholder="Select end date" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <DatePicker date={birthDate} setDate={setBirthDate} placeholder="Select your birthday" />
        </div>

        {(startDate || endDate || birthDate) && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Form Data:</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Start: {startDate?.toLocaleDateString() || "Not selected"}</p>
              <p>End: {endDate?.toLocaleDateString() || "Not selected"}</p>
              <p>Birth: {birthDate?.toLocaleDateString() || "Not selected"}</p>
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const SchedulingExample: Story = {
  render: () => {
    const [postDate, setPostDate] = useState<Date | undefined>();
    const [reminderDate, setReminderDate] = useState<Date | undefined>();

    return (
      <div className="w-[400px] space-y-6">
        <h3 className="text-lg font-semibold">Content Scheduling</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Post Date</label>
          <DatePicker date={postDate} setDate={setPostDate} placeholder="When to publish" />
          <p className="text-xs text-muted-foreground">
            Select when this content should be published
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reminder Date</label>
          <DatePicker date={reminderDate} setDate={setReminderDate} placeholder="Reminder date" />
          <p className="text-xs text-muted-foreground">Get notified to review this content</p>
        </div>

        {(postDate || reminderDate) && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Schedule Summary:</h4>
            <div className="space-y-1 text-sm text-blue-800">
              {postDate && <p>📅 Publish: {postDate.toLocaleDateString()}</p>}
              {reminderDate && <p>🔔 Reminder: {reminderDate.toLocaleDateString()}</p>}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const CompareDates: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date | undefined>();
    const [date2, setDate2] = useState<Date | undefined>();

    const daysDifference =
      date1 && date2
        ? Math.abs(Math.ceil((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)))
        : null;

    return (
      <div className="w-[400px] space-y-6">
        <h3 className="text-lg font-semibold">Date Comparison</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">First Date</label>
          <DatePicker date={date1} setDate={setDate1} placeholder="Select first date" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Second Date</label>
          <DatePicker date={date2} setDate={setDate2} placeholder="Select second date" />
        </div>

        {daysDifference !== null && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>{daysDifference}</strong> day{daysDifference !== 1 ? "s" : ""} between dates
            </p>
          </div>
        )}
      </div>
    );
  },
};
