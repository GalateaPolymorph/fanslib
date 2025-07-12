import type { Meta, StoryObj } from "@storybook/react";
import { Bell, ChevronDown, Settings, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import { Card, CardContent, CardHeader, CardTitle } from "../Card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./index";

const meta: Meta<typeof Collapsible> = {
  title: "UI/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: {
      control: { type: "boolean" },
      description: "Whether the collapsible is open by default",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the collapsible is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4">
          <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/primitives</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 font-mono text-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const FAQ: Story = {
  render: () => {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (item: string) => {
      setOpenItems((prev) =>
        prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
      );
    };

    const faqs = [
      {
        id: "faq1",
        question: "What is FansLib?",
        answer:
          "FansLib is a desktop application for managing adult content creators' content libraries. It helps organize, tag, and schedule content across multiple platforms.",
      },
      {
        id: "faq2",
        question: "How do I import my existing content?",
        answer:
          "You can import content by scanning directories, connecting your existing platforms, or manually uploading files. The app supports various file formats including images and videos.",
      },
      {
        id: "faq3",
        question: "Can I schedule posts automatically?",
        answer:
          "Yes, FansLib includes advanced scheduling features that allow you to plan and automatically post content to connected platforms at optimal times.",
      },
    ];

    return (
      <div className="w-[500px] space-y-4">
        <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
        {faqs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItems.includes(faq.id)}
            onOpenChange={() => toggleItem(faq.id)}
          >
            <Card>
              <CardHeader className="pb-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                    <CardTitle className="text-left text-base">{faq.question}</CardTitle>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openItems.includes(faq.id) ? "rotate-180" : ""}`}
                    />
                  </Button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    );
  },
};

export const Navigation: Story = {
  render: () => {
    const [openSections, setOpenSections] = useState<string[]>(["settings"]);

    const toggleSection = (section: string) => {
      setOpenSections((prev) =>
        prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
      );
    };

    return (
      <div className="w-[300px] space-y-2 p-4 border rounded-lg">
        <h3 className="font-semibold mb-4">Navigation Menu</h3>

        <Collapsible
          open={openSections.includes("settings")}
          onOpenChange={() => toggleSection("settings")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.includes("settings") ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-6">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              General
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Appearance
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Privacy
            </Button>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openSections.includes("users")}
          onOpenChange={() => toggleSection("users")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Users
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.includes("users") ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-6">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              All Users
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Add User
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Permissions
            </Button>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={openSections.includes("notifications")}
          onOpenChange={() => toggleSection("notifications")}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${openSections.includes("notifications") ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-6">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Email
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              Push
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Default Open Example</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 text-sm">Always visible content</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">This content is shown by default</div>
        <div className="rounded-md border px-4 py-3 text-sm">Because defaultOpen is true</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled className="w-[350px] space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">Disabled Collapsible</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0" disabled>
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 text-sm">Always visible content</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm">This content cannot be toggled</div>
      </CollapsibleContent>
    </Collapsible>
  ),
};
