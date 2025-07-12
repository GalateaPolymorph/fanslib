import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileInput } from "./index";

const meta: Meta<typeof FileInput> = {
  title: "UI/FileInput",
  component: FileInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    directory: {
      control: { type: "boolean" },
      description: "Whether to select directories instead of files",
    },
    buttonVariant: {
      control: { type: "select" },
      options: ["default", "outline", "ghost"],
      description: "Browse button variant",
    },
    placeholder: {
      control: { type: "text" },
      description: "Placeholder text for the input",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the input is disabled",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[400px] space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Select a File</h3>
          <FileInput value={value} onChange={setValue} />
        </div>
        {value && <p className="text-sm text-muted-foreground">Selected: {value}</p>}
      </div>
    );
  },
};

export const DirectorySelection: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[400px] space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Select a Directory</h3>
          <FileInput
            value={value}
            onChange={setValue}
            directory={true}
            placeholder="Select a folder..."
          />
        </div>
        {value && <p className="text-sm text-muted-foreground">Selected folder: {value}</p>}
      </div>
    );
  },
};

export const CustomPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <div className="w-[400px] space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Custom Placeholder</h3>
          <FileInput value={value} onChange={setValue} placeholder="Choose your image file..." />
        </div>
      </div>
    );
  },
};

export const ButtonVariants: Story = {
  render: () => {
    const [defaultValue, setDefaultValue] = useState("");
    const [outlineValue, setOutlineValue] = useState("");
    const [ghostValue, setGhostValue] = useState("");

    return (
      <div className="w-[400px] space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Default Button</h3>
          <FileInput
            value={defaultValue}
            onChange={setDefaultValue}
            buttonVariant="default"
            placeholder="Select file..."
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Outline Button</h3>
          <FileInput
            value={outlineValue}
            onChange={setOutlineValue}
            buttonVariant="outline"
            placeholder="Select file..."
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Ghost Button</h3>
          <FileInput
            value={ghostValue}
            onChange={setGhostValue}
            buttonVariant="ghost"
            placeholder="Select file..."
          />
        </div>
      </div>
    );
  },
};

export const LibrarySettings: Story = {
  render: () => {
    const [contentPath, setContentPath] = useState("/Users/jane/Content");
    const [backupPath, setBackupPath] = useState("");
    const [exportPath, setExportPath] = useState("");

    return (
      <div className="w-[500px] space-y-6">
        <h3 className="text-lg font-semibold">Library Configuration</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content Library Path</label>
          <FileInput
            value={contentPath}
            onChange={setContentPath}
            directory={true}
            placeholder="Select content library folder"
          />
          <p className="text-xs text-muted-foreground">Main folder where your content is stored</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Backup Directory</label>
          <FileInput
            value={backupPath}
            onChange={setBackupPath}
            directory={true}
            placeholder="Select backup folder"
          />
          <p className="text-xs text-muted-foreground">Where to store library backups</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Export Directory</label>
          <FileInput
            value={exportPath}
            onChange={setExportPath}
            directory={true}
            placeholder="Select export folder"
          />
          <p className="text-xs text-muted-foreground">Default location for exported content</p>
        </div>

        {(contentPath || backupPath || exportPath) && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Configuration Summary:</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {contentPath && <p>📁 Library: {contentPath}</p>}
              {backupPath && <p>💾 Backup: {backupPath}</p>}
              {exportPath && <p>📤 Export: {exportPath}</p>}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const ImportContent: Story = {
  render: () => {
    const [imageFile, setImageFile] = useState("");
    const [videoFile, setVideoFile] = useState("");
    const [importFolder, setImportFolder] = useState("");

    return (
      <div className="w-[500px] space-y-6">
        <h3 className="text-lg font-semibold">Import Content</h3>

        <div className="space-y-2">
          <label className="text-sm font-medium">Single Image</label>
          <FileInput
            value={imageFile}
            onChange={setImageFile}
            placeholder="Choose image file..."
            accept="image/*"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Video File</label>
          <FileInput
            value={videoFile}
            onChange={setVideoFile}
            placeholder="Choose video file..."
            accept="video/*"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Import Entire Folder</label>
          <FileInput
            value={importFolder}
            onChange={setImportFolder}
            directory={true}
            placeholder="Select folder to import..."
          />
          <p className="text-xs text-muted-foreground">Import all content from a folder</p>
        </div>

        {(imageFile || videoFile || importFolder) && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">Import Queue:</h4>
            <div className="space-y-1 text-sm text-green-800">
              {imageFile && <p>🖼️ Image: {imageFile.split("/").pop() || imageFile}</p>}
              {videoFile && <p>🎥 Video: {videoFile.split("/").pop() || videoFile}</p>}
              {importFolder && <p>📁 Folder: {importFolder}</p>}
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const ManualPath: Story = {
  render: () => {
    const [filePath, setFilePath] = useState("");

    return (
      <div className="w-[400px] space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Manual Path Entry</h3>
          <FileInput
            value={filePath}
            onTextChange={setFilePath}
            placeholder="Type or browse for file..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            You can type the path directly or use the browse button
          </p>
        </div>
        {filePath && <p className="text-sm text-muted-foreground">Path: {filePath}</p>}
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Disabled File Input</h3>
        <FileInput
          value="/path/to/locked/file.jpg"
          onChange={() => {}}
          disabled
          placeholder="Cannot change..."
        />
        <p className="text-xs text-muted-foreground mt-1">This file input is disabled</p>
      </div>
    </div>
  ),
};
