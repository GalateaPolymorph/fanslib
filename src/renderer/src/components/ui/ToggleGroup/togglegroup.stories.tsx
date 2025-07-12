import type { Meta, StoryObj } from "@storybook/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Calendar,
  Download,
  Eye,
  FileText,
  Grid,
  Heart,
  Image,
  Italic,
  List,
  SortAsc,
  SortDesc,
  Star,
  ThumbsUp,
  Underline,
  Video,
} from "lucide-react";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./index";

const meta: Meta<typeof ToggleGroup> = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["single", "multiple"],
      description: "Selection type",
    },
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "Group orientation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="space-y-4">
        <ToggleGroup type="single" value={value} onValueChange={setValue}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">Selected: {value || "None"}</p>
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);

    return (
      <div className="space-y-4">
        <ToggleGroup type="multiple" value={values} onValueChange={setValues}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">
          Selected: {values.length > 0 ? values.join(", ") : "None"}
        </p>
      </div>
    );
  },
};

export const TextFormatting: Story = {
  render: () => {
    const [formatting, setFormatting] = useState<string[]>([]);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Text Formatting</h3>
          <ToggleGroup type="multiple" value={formatting} onValueChange={setFormatting}>
            <ToggleGroupItem value="bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="mt-4 p-3 border rounded">
            <p
              className={`text-sm ${formatting.includes("bold") ? "font-bold" : ""} ${
                formatting.includes("italic") ? "italic" : ""
              } ${formatting.includes("underline") ? "underline" : ""}`}
            >
              Sample text with applied formatting
            </p>
          </div>
        </div>
      </div>
    );
  },
};

export const TextAlignment: Story = {
  render: () => {
    const [alignment, setAlignment] = useState("left");

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Text Alignment</h3>
        <ToggleGroup type="single" value={alignment} onValueChange={setAlignment}>
          <ToggleGroupItem value="left">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="mt-4 p-4 border rounded">
          <p
            className={`text-sm ${
              alignment === "center"
                ? "text-center"
                : alignment === "right"
                  ? "text-right"
                  : "text-left"
            }`}
          >
            This text alignment changes based on your selection above.
          </p>
        </div>
      </div>
    );
  },
};

export const ViewModes: Story = {
  render: () => {
    const [viewMode, setViewMode] = useState("grid");

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Content View</h3>
          <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
            <ToggleGroupItem value="grid">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="p-4 border rounded">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <span className="text-sm">Item {i + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
};

export const ContentFilters: Story = {
  render: () => {
    const [contentTypes, setContentTypes] = useState<string[]>(["image"]);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Content Type Filter</h3>
          <ToggleGroup type="multiple" value={contentTypes} onValueChange={setContentTypes}>
            <ToggleGroupItem value="image">
              <Image className="h-4 w-4 mr-2" />
              Images
            </ToggleGroupItem>
            <ToggleGroupItem value="video">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </ToggleGroupItem>
            <ToggleGroupItem value="document">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="p-4 border rounded">
          <h4 className="text-sm font-medium mb-3">Filtered Content</h4>
          <div className="space-y-2">
            {contentTypes.includes("image") && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Image className="h-4 w-4" />
                <span className="text-sm">photo_001.jpg</span>
              </div>
            )}
            {contentTypes.includes("video") && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <Video className="h-4 w-4" />
                <span className="text-sm">video_002.mp4</span>
              </div>
            )}
            {contentTypes.includes("document") && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                <FileText className="h-4 w-4" />
                <span className="text-sm">document_003.pdf</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};

export const ReactionButtons: Story = {
  render: () => {
    const [reactions, setReactions] = useState<string[]>([]);

    return (
      <div className="space-y-4">
        <div className="p-6 border rounded-lg bg-gray-50">
          <h3 className="font-medium mb-2">Amazing sunset photoshoot!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Had an incredible time capturing the golden hour. The lighting was absolutely perfect!
            What do you think of this style?
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">React:</span>
            <ToggleGroup type="multiple" value={reactions} onValueChange={setReactions}>
              <ToggleGroupItem value="heart">
                <Heart className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="star">
                <Star className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="thumbsup">
                <ThumbsUp className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {reactions.length > 0 && (
            <div className="mt-3 text-sm text-muted-foreground">
              You reacted with: {reactions.join(", ")}
            </div>
          )}
        </div>
      </div>
    );
  },
};

export const SortingOptions: Story = {
  render: () => {
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Sort by</label>
            <ToggleGroup type="single" value={sortBy} onValueChange={setSortBy}>
              <ToggleGroupItem value="date">
                <Calendar className="h-4 w-4 mr-2" />
                Date
              </ToggleGroupItem>
              <ToggleGroupItem value="views">
                <Eye className="h-4 w-4 mr-2" />
                Views
              </ToggleGroupItem>
              <ToggleGroupItem value="downloads">
                <Download className="h-4 w-4 mr-2" />
                Downloads
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Order</label>
            <ToggleGroup type="single" value={sortOrder} onValueChange={setSortOrder}>
              <ToggleGroupItem value="asc">
                <SortAsc className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="desc">
                <SortDesc className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h4 className="text-sm font-medium mb-2">
            Sorted by {sortBy} ({sortOrder === "asc" ? "ascending" : "descending"})
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
              <span>content_001.jpg</span>
              <span className="text-muted-foreground">
                {sortBy === "date"
                  ? "2024-01-15"
                  : sortBy === "views"
                    ? "1,234 views"
                    : "89 downloads"}
              </span>
            </div>
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
              <span>video_002.mp4</span>
              <span className="text-muted-foreground">
                {sortBy === "date"
                  ? "2024-01-14"
                  : sortBy === "views"
                    ? "2,567 views"
                    : "156 downloads"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

export const Vertical: Story = {
  render: () => {
    const [value, setValue] = useState("medium");

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Image Quality</h3>
        <ToggleGroup type="single" value={value} onValueChange={setValue} orientation="vertical">
          <ToggleGroupItem value="low">Low</ToggleGroupItem>
          <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
          <ToggleGroupItem value="high">High</ToggleGroupItem>
          <ToggleGroupItem value="ultra">Ultra</ToggleGroupItem>
        </ToggleGroup>
        <p className="text-sm text-muted-foreground">Selected quality: {value}</p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Disabled Options</h3>
      <ToggleGroup type="single" defaultValue="available">
        <ToggleGroupItem value="available">Available</ToggleGroupItem>
        <ToggleGroupItem value="disabled" disabled>
          Disabled
        </ToggleGroupItem>
        <ToggleGroupItem value="another">Another</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
