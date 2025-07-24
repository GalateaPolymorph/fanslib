import type { Meta, StoryObj } from "@storybook/react";
import {
  Calculator,
  Calendar,
  Copy,
  CreditCard,
  Edit3,
  FileText,
  Search,
  Settings,
  Smile,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../Button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./index";

const meta: Meta<typeof Command> = {
  title: "UI/Command",
  component: Command,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const SearchExample: Story = {
  render: () => {
    const [searchTerm, setSearchTerm] = useState("");

    const files = [
      { name: "Document 1.pdf", type: "file" },
      { name: "Presentation.pptx", type: "file" },
      { name: "Spreadsheet.xlsx", type: "file" },
      { name: "Notes.txt", type: "file" },
      { name: "Photos", type: "folder" },
      { name: "Videos", type: "folder" },
      { name: "Downloads", type: "folder" },
    ];

    const filteredFiles = files.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <Command className="w-[450px] rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search files and folders..."
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>No files found.</CommandEmpty>
          <CommandGroup heading="Files">
            {filteredFiles
              .filter((item) => item.type === "file")
              .map((file, index) => (
                <CommandItem key={index}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{file.name}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          {filteredFiles.some((item) => item.type === "folder") && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Folders">
                {filteredFiles
                  .filter((item) => item.type === "folder")
                  .map((folder, index) => (
                    <CommandItem key={index}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{folder.name}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    );
  },
};

export const CommandDialogExample: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open Command Dialog
          <CommandShortcut>⌘K</CommandShortcut>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Quick Actions">
              <CommandItem onSelect={() => setOpen(false)}>
                <Search className="mr-2 h-4 w-4" />
                <span>Search Content</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Edit3 className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
                <CommandShortcut>⌘E</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Dangerous Actions">
              <CommandItem className="text-red-500" onSelect={() => setOpen(false)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Account</span>
                <CommandShortcut>⌘⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    );
  },
};

export const ActionsMenu: Story = {
  render: () => {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    const handleSelect = (action: string) => {
      setSelectedAction(action);
      setTimeout(() => setSelectedAction(null), 2000);
    };

    return (
      <div className="space-y-4">
        <Command className="w-[450px] rounded-lg border shadow-md">
          <CommandInput placeholder="Choose an action..." />
          <CommandList>
            <CommandEmpty>No actions found.</CommandEmpty>
            <CommandGroup heading="Content Actions">
              <CommandItem onSelect={() => handleSelect("Create new post")}>
                <Edit3 className="mr-2 h-4 w-4" />
                <span>Create New Post</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("Upload media")}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Upload Media</span>
                <CommandShortcut>⌘U</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("Schedule content")}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Schedule Content</span>
                <CommandShortcut>⌘T</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Library Actions">
              <CommandItem onSelect={() => handleSelect("Scan library")}>
                <Search className="mr-2 h-4 w-4" />
                <span>Scan Library</span>
                <CommandShortcut>⌘L</CommandShortcut>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect("Backup library")}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Backup Library</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        {selectedAction && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              Action executed: <strong>{selectedAction}</strong>
            </p>
          </div>
        )}
      </div>
    );
  },
};

export const MultipleGroups: Story = {
  render: () => (
    <Command className="w-[450px] rounded-lg border shadow-md">
      <CommandInput placeholder="Search navigation..." />
      <CommandList>
        <CommandEmpty>No navigation items found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Content Library</span>
          </CommandItem>
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Schedule</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Analytics">
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Performance</span>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Revenue</span>
          </CommandItem>
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Audience</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>General Settings</span>
          </CommandItem>
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </CommandItem>
          <CommandItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
