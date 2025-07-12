import type { Meta, StoryObj } from "@storybook/react";
import { useRef } from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./index";

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "UI/Resizable",
  component: ResizablePanelGroup,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" id="default-example">
        <ResizablePanel isFirst={true} defaultSize={30}>
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-lg font-semibold">Panel 1</p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel isFirst={false} defaultSize={70}>
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-lg font-semibold">Panel 2</p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" id="three-panels-example">
        <ResizablePanel isFirst={true} defaultSize={25}>
          <div className="h-full flex items-center justify-center border-2 border-dashed border-blue-300 rounded-lg">
            <p className="text-lg font-semibold text-blue-700">Sidebar</p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel isFirst={false} defaultSize={50}>
          <div className="h-full flex items-center justify-center border-2 border-dashed border-green-300 rounded-lg">
            <p className="text-lg font-semibold text-green-700">Main Content</p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel isFirst={false} defaultSize={25}>
          <div className="h-full flex items-center justify-center border-2 border-dashed border-purple-300 rounded-lg">
            <p className="text-lg font-semibold text-purple-700">Inspector</p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const VerticalLayout: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="vertical" id="vertical-example">
        <ResizablePanel isFirst={true} defaultSize={30}>
          <div className="h-full flex items-center justify-center border-2 border-dashed border-red-300 rounded-lg">
            <p className="text-lg font-semibold text-red-700">Header</p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel isFirst={false} defaultSize={70}>
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-lg font-semibold">Content Area</p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const CollapsibleSidebar: Story = {
  render: () => {
    const groupRef = useRef<ResizablePrimitive.ImperativePanelGroupHandle>(null);

    return (
      <div className="h-[600px] w-full">
        <ResizablePanelGroup direction="horizontal" id="collapsible-example" ref={groupRef}>
          <ResizablePanel
            isFirst={true}
            defaultSize={25}
            collapsible={true}
            collapsedSize={5}
            headerSlot={<h3 className="font-semibold">Navigation</h3>}
            groupRef={groupRef}
            panelIndex={0}
          >
            <div className="p-4 space-y-2">
              <div className="p-2 bg-gray-100 rounded">Dashboard</div>
              <div className="p-2 bg-gray-100 rounded">Content Library</div>
              <div className="p-2 bg-gray-100 rounded">Analytics</div>
              <div className="p-2 bg-gray-100 rounded">Settings</div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel isFirst={false} defaultSize={75}>
            <div className="h-full p-6">
              <h2 className="text-2xl font-bold mb-4">Main Content Area</h2>
              <div className="space-y-4">
                <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  Content Block 1
                </div>
                <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  Content Block 2
                </div>
                <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  Content Block 3
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  },
};

export const NestedPanels: Story = {
  render: () => (
    <div className="h-[600px] w-full">
      <ResizablePanelGroup direction="horizontal" id="nested-example-main">
        <ResizablePanel isFirst={true} defaultSize={30}>
          <div className="h-full p-4 border-2 border-dashed border-blue-300 rounded-lg">
            <h3 className="font-semibold mb-4 text-blue-700">Left Panel</h3>
            <ResizablePanelGroup direction="vertical" id="nested-example-left">
              <ResizablePanel isFirst={true} defaultSize={60}>
                <div className="h-full flex items-center justify-center bg-blue-50 rounded">
                  <p>Top Section</p>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel isFirst={false} defaultSize={40}>
                <div className="h-full flex items-center justify-center bg-blue-100 rounded">
                  <p>Bottom Section</p>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel isFirst={false} defaultSize={70}>
          <div className="h-full p-4 border-2 border-dashed border-green-300 rounded-lg">
            <h3 className="font-semibold mb-4 text-green-700">Right Panel</h3>
            <div className="h-full bg-green-50 rounded flex items-center justify-center">
              <p>Main Content</p>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const ContentEditor: Story = {
  render: () => {
    const mainGroupRef = useRef<ResizablePrimitive.ImperativePanelGroupHandle>(null);
    const rightGroupRef = useRef<ResizablePrimitive.ImperativePanelGroupHandle>(null);

    return (
      <div className="h-[600px] w-full">
        <ResizablePanelGroup direction="horizontal" id="editor-example" ref={mainGroupRef}>
          <ResizablePanel
            isFirst={true}
            defaultSize={20}
            collapsible={true}
            collapsedSize={4}
            headerSlot={<h3 className="font-semibold">File Explorer</h3>}
            groupRef={mainGroupRef}
            panelIndex={0}
          >
            <div className="p-4 space-y-1">
              <div className="text-sm font-medium">📁 src/</div>
              <div className="text-sm pl-4">📄 App.tsx</div>
              <div className="text-sm pl-4">📄 index.tsx</div>
              <div className="text-sm font-medium">📁 components/</div>
              <div className="text-sm pl-4">📄 Button.tsx</div>
              <div className="text-sm pl-4">📄 Input.tsx</div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel isFirst={false} defaultSize={55}>
            <div className="h-full p-4">
              <h3 className="font-semibold mb-4">Editor</h3>
              <div className="h-full bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                <div>import React from 'react';</div>
                <div></div>
                <div>const App = () =&gt; {`{`}</div>
                <div className="pl-4">return (</div>
                <div className="pl-8">&lt;div&gt;Hello World&lt;/div&gt;</div>
                <div className="pl-4">);</div>
                <div>{`}`};</div>
                <div></div>
                <div>export default App;</div>
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel isFirst={false} defaultSize={25}>
            <div className="h-full">
              <ResizablePanelGroup direction="vertical" id="editor-right-panel" ref={rightGroupRef}>
                <ResizablePanel
                  isFirst={true}
                  defaultSize={50}
                  collapsible={true}
                  headerSlot={<h4 className="font-medium">Properties</h4>}
                  groupRef={rightGroupRef}
                  panelIndex={0}
                >
                  <div className="p-4 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Type:</span> Component
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Props:</span> none
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">State:</span> none
                    </div>
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel isFirst={false} defaultSize={50}>
                  <div className="p-4">
                    <h4 className="font-medium mb-2">Console</h4>
                    <div className="bg-black text-white p-2 rounded text-xs font-mono">
                      <div>$ npm start</div>
                      <div className="text-green-400">✓ Compiled successfully!</div>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  },
};

export const DashboardLayout: Story = {
  render: () => {
    const groupRef = useRef<ResizablePrimitive.ImperativePanelGroupHandle>(null);

    return (
      <div className="h-[600px] w-full">
        <ResizablePanelGroup direction="vertical" id="dashboard-main">
          <ResizablePanel isFirst={true} defaultSize={15}>
            <div className="h-full bg-blue-600 text-white p-4 flex items-center justify-between">
              <h1 className="text-xl font-bold">FansLib Dashboard</h1>
              <div className="text-sm">Welcome, Creator</div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel isFirst={false} defaultSize={85}>
            <ResizablePanelGroup direction="horizontal" id="dashboard-content" ref={groupRef}>
              <ResizablePanel
                isFirst={true}
                defaultSize={20}
                collapsible={true}
                collapsedSize={5}
                headerSlot={<h3 className="font-semibold">Quick Actions</h3>}
                groupRef={groupRef}
                panelIndex={0}
              >
                <div className="p-4 space-y-3">
                  <button className="w-full p-2 bg-blue-500 text-white rounded text-sm">
                    Upload Content
                  </button>
                  <button className="w-full p-2 bg-green-500 text-white rounded text-sm">
                    Schedule Post
                  </button>
                  <button className="w-full p-2 bg-purple-500 text-white rounded text-sm">
                    View Analytics
                  </button>
                  <button className="w-full p-2 bg-orange-500 text-white rounded text-sm">
                    Manage Tags
                  </button>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel isFirst={false} defaultSize={80}>
                <div className="h-full p-6">
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Recent Uploads</h3>
                      <div className="space-y-2">
                        <div className="text-sm p-2 bg-gray-50 rounded">photo_001.jpg</div>
                        <div className="text-sm p-2 bg-gray-50 rounded">video_002.mp4</div>
                        <div className="text-sm p-2 bg-gray-50 rounded">photo_003.jpg</div>
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Analytics Overview</h3>
                      <div className="space-y-2">
                        <div className="text-sm">Views: 1,234</div>
                        <div className="text-sm">Likes: 456</div>
                        <div className="text-sm">Revenue: $789</div>
                      </div>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Scheduled Posts</h3>
                      <div className="text-sm text-gray-600">3 posts scheduled for today</div>
                    </div>
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Library Stats</h3>
                      <div className="space-y-1">
                        <div className="text-sm">Total Items: 1,567</div>
                        <div className="text-sm">Storage Used: 45.2 GB</div>
                      </div>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  },
};
