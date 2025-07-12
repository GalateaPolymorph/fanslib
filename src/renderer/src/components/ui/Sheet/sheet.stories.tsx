import type { Meta, StoryObj } from "@storybook/react";
import { Bell, Download, Filter, Plus, Search, Settings, Share2, User } from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { Label } from "../Label";
import { Separator } from "../Separator";
import { Switch } from "../Switch";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./index";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Jane Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@janedoe" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Application Settings</SheetTitle>
          <SheetDescription>Configure your application preferences.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium">Appearance</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compact-view">Compact View</Label>
              <Switch id="compact-view" />
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium">Notifications</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" />
            </div>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Apply Settings</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const TopSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Search Content</SheetTitle>
          <SheetDescription>
            Search through your content library using keywords, tags, or metadata.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="search-query">Search Query</Label>
            <Input
              id="search-query"
              placeholder="Enter keywords, tags, or filenames..."
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="content-type">Content Type</Label>
              <select id="content-type" className="w-full mt-1 p-2 border rounded">
                <option>All Types</option>
                <option>Images</option>
                <option>Videos</option>
                <option>Documents</option>
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="date-range">Date Range</Label>
              <select id="date-range" className="w-full mt-1 p-2 border rounded">
                <option>All Time</option>
                <option>Last Week</option>
                <option>Last Month</option>
                <option>Last Year</option>
              </select>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">Clear</Button>
          <SheetClose asChild>
            <Button>Search</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const BottomSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Quick Actions
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>Frequently used actions for content management.</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
          <Button className="h-20 flex-col gap-2">
            <Plus className="h-6 w-6" />
            Upload Content
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Filter className="h-6 w-6" />
            Create Filter
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Download className="h-6 w-6" />
            Export Library
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Share2 className="h-6 w-6" />
            Share Collection
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <User className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Profile Settings</SheetTitle>
          <SheetDescription>Manage your account settings and preferences.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              JD
            </div>
            <div>
              <h3 className="font-medium">Jane Doe</h3>
              <p className="text-sm text-muted-foreground">Content Creator</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input id="display-name" defaultValue="Jane Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="jane@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" defaultValue="Fitness enthusiast and lifestyle content creator" />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Privacy Settings</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-visibility">Public Profile</Label>
              <Switch id="profile-visibility" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics-sharing">Share Analytics</Label>
              <Switch id="analytics-sharing" />
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline">Cancel</Button>
          <SheetClose asChild>
            <Button>Save Changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const ContentFilters: Story = {
  render: () => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const toggleTag = (tag: string) => {
      setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    };

    const tags = ["fitness", "lifestyle", "tutorial", "behind-scenes", "Q&A", "collaboration"];

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter Content
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Content Filters</SheetTitle>
            <SheetDescription>Filter your content library by various criteria.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <Label>Content Type</Label>
              <div className="space-y-2">
                {["All", "Images", "Videos", "Documents"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={type}
                      name="content-type"
                      defaultChecked={type === "All"}
                    />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date-from" className="text-xs">
                    From
                  </Label>
                  <Input id="date-from" type="date" />
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-xs">
                    To
                  </Label>
                  <Input id="date-to" type="date" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>File Size</Label>
              <div className="space-y-2">
                {["Any size", "Under 10MB", "10MB - 100MB", "Over 100MB"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={size}
                      name="file-size"
                      defaultChecked={size === "Any size"}
                    />
                    <Label htmlFor={size}>{size}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline">Reset</Button>
            <SheetClose asChild>
              <Button>Apply Filters</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
};

export const NotificationCenter: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Recent activity and system updates.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Content Upload Complete</p>
                <p className="text-xs text-muted-foreground">
                  summer_photoshoot_final.jpg uploaded successfully
                </p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Post Scheduled</p>
                <p className="text-xs text-muted-foreground">
                  Your workout tutorial is scheduled for tomorrow at 9 AM
                </p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-gray-50 border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">Analytics Report Ready</p>
                <p className="text-xs text-muted-foreground">
                  Your weekly performance report is available
                </p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-gray-50 border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">Backup Complete</p>
                <p className="text-xs text-muted-foreground">
                  Library backup saved to external drive
                </p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-gray-50 border rounded-lg">
              <div className="w-2 h-2 rounded-full bg-gray-400 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">Tag Suggestion</p>
                <p className="text-xs text-muted-foreground">
                  New tag "outdoor-fitness" suggested for 5 items
                </p>
                <p className="text-xs text-muted-foreground">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
