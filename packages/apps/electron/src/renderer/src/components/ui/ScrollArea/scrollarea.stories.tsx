import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea, ScrollBar } from "./index";

const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="text-sm">
            Tag {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const LongContent: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Content Library Guidelines</h4>
      <div className="text-sm space-y-4">
        <p>
          Welcome to FansLib, your comprehensive content management solution. This application helps
          content creators organize, tag, and schedule their digital assets across multiple
          platforms.
        </p>
        <p>
          <strong>Getting Started:</strong> Begin by scanning your existing content directories. The
          application will automatically detect supported file formats including images, videos, and
          documents. Each file will be indexed with metadata such as creation date, file size, and
          format information.
        </p>
        <p>
          <strong>Tagging System:</strong> Use our advanced tagging system to categorize your
          content. Tags can be hierarchical, allowing for detailed organization. For example, you
          might use tags like &quot;photoshoot/outdoor/summer&quot; or &quot;video/tutorial/beginner&quot;.
        </p>
        <p>
          <strong>Content Scheduling:</strong> Plan your content releases using our scheduling
          features. You can set up posting schedules for multiple platforms, with automatic
          optimization for peak engagement times.
        </p>
        <p>
          <strong>Analytics Integration:</strong> Track the performance of your content across
          platforms. View engagement metrics, revenue data, and audience insights to optimize your
          content strategy.
        </p>
        <p>
          <strong>Security:</strong> All content is stored locally on your device. FansLib does not
          upload or store your files on external servers, ensuring your content remains private and
          secure.
        </p>
      </div>
    </ScrollArea>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="shrink-0 w-32 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-semibold"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const ContentGallery: Story = {
  render: () => (
    <ScrollArea className="h-96 w-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Content Gallery</h4>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-pink-300 to-blue-300 rounded-lg flex items-center justify-center text-sm font-medium"
            >
              {i % 3 === 0 ? "🖼️" : i % 3 === 1 ? "🎥" : "📄"}
              <br />
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};

export const ChatMessages: Story = {
  render: () => (
    <ScrollArea className="h-80 w-80 rounded-md border">
      <div className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            J
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Jane</div>
            <div className="text-sm bg-gray-100 rounded-lg p-2 mt-1">
              Hey! How&apos;s the new content management system working out?
            </div>
            <div className="text-xs text-gray-500 mt-1">2:30 PM</div>
          </div>
        </div>

        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
            M
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm font-medium">Me</div>
            <div className="text-sm bg-blue-500 text-white rounded-lg p-2 mt-1 inline-block">
              It&apos;s amazing! The tagging system is so intuitive.
            </div>
            <div className="text-xs text-gray-500 mt-1">2:32 PM</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            J
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Jane</div>
            <div className="text-sm bg-gray-100 rounded-lg p-2 mt-1">
              That&apos;s great to hear! Have you tried the scheduling features yet?
            </div>
            <div className="text-xs text-gray-500 mt-1">2:33 PM</div>
          </div>
        </div>

        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
            M
          </div>
          <div className="flex-1 text-right">
            <div className="text-sm font-medium">Me</div>
            <div className="text-sm bg-blue-500 text-white rounded-lg p-2 mt-1 inline-block">
              Yes! I scheduled a whole week&apos;s worth of posts yesterday. The analytics integration is
              fantastic too.
            </div>
            <div className="text-xs text-gray-500 mt-1">2:35 PM</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
            J
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Jane</div>
            <div className="text-sm bg-gray-100 rounded-lg p-2 mt-1">
              Perfect! Let me know if you need any help with the advanced features.
            </div>
            <div className="text-xs text-gray-500 mt-1">2:36 PM</div>
          </div>
        </div>
      </div>
    </ScrollArea>
  ),
};

export const FileList: Story = {
  render: () => (
    <ScrollArea className="h-72 w-96 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Recent Files</h4>
        <div className="space-y-2">
          {[
            { name: "summer_photoshoot_001.jpg", size: "2.4 MB", date: "2 hours ago" },
            { name: "tutorial_video_final.mp4", size: "145.2 MB", date: "4 hours ago" },
            { name: "behind_scenes_raw.mov", size: "89.7 MB", date: "6 hours ago" },
            { name: "product_showcase_edit.jpg", size: "3.1 MB", date: "8 hours ago" },
            { name: "livestream_highlights.mp4", size: "67.8 MB", date: "1 day ago" },
            { name: "promo_banner_final.png", size: "1.2 MB", date: "1 day ago" },
            { name: "workout_routine_part2.mp4", size: "123.4 MB", date: "2 days ago" },
            { name: "outfit_planning_grid.jpg", size: "4.6 MB", date: "2 days ago" },
            { name: "subscriber_thank_you.mp4", size: "34.5 MB", date: "3 days ago" },
            { name: "content_calendar_notes.txt", size: "12 KB", date: "3 days ago" },
            { name: "brand_collaboration_pics.zip", size: "78.9 MB", date: "4 days ago" },
            { name: "q_and_a_session_raw.mov", size: "156.7 MB", date: "5 days ago" },
          ].map((file, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <div className="text-lg">
                  {file.name.endsWith(".mp4") || file.name.endsWith(".mov")
                    ? "🎥"
                    : file.name.endsWith(".jpg") || file.name.endsWith(".png")
                      ? "🖼️"
                      : "📄"}
                </div>
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-gray-500">{file.size}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{file.date}</div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  ),
};

export const TagCloud: Story = {
  render: () => (
    <ScrollArea className="h-64 w-80 rounded-md border p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Popular Tags</h4>
      <div className="flex flex-wrap gap-2">
        {[
          "fitness",
          "lifestyle",
          "tutorial",
          "behind-scenes",
          "Q&A",
          "collaboration",
          "product-review",
          "daily-vlog",
          "workout",
          "nutrition",
          "skincare",
          "fashion",
          "travel",
          "cooking",
          "DIY",
          "technology",
          "gaming",
          "music",
          "art",
          "photography",
          "business",
          "motivation",
          "mindfulness",
          "productivity",
          "relationships",
          "health",
          "beauty",
          "home-decor",
          "pets",
          "outdoors",
          "sports",
          "education",
          "comedy",
          "drama",
          "horror",
          "action",
          "romance",
          "documentary",
          "animation",
          "indie",
        ].map((tag, i) => (
          <span
            key={i}
            className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const DataTable: Story = {
  render: () => (
    <div className="w-full">
      <ScrollArea className="h-80 w-full rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Content Performance</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Content</th>
                <th className="text-left p-2">Views</th>
                <th className="text-left p-2">Likes</th>
                <th className="text-left p-2">Revenue</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 25 }, (_, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">Content Item {i + 1}</td>
                  <td className="p-2">{Math.floor(Math.random() * 10000)}</td>
                  <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                  <td className="p-2">${Math.floor(Math.random() * 500)}</td>
                  <td className="p-2">2024-01-{String(i + 1).padStart(2, "0")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  ),
};
