import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpDown, Download, Eye, MoreHorizontal, Star } from "lucide-react";
import { Badge } from "../Badge";
import { Button } from "../Button";
import { Checkbox } from "../Checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../DropdownMenu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./index";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV004</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$450.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const ContentLibrary: Story = {
  render: () => (
    <div className="w-[900px]">
      <Table>
        <TableCaption>Your content library overview.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded flex items-center justify-center text-white text-xs">
                  🖼️
                </div>
                <div>
                  <div className="font-medium">Summer Photoshoot</div>
                  <div className="text-sm text-muted-foreground">photo_001.jpg</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">Image</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Badge variant="secondary">#fitness</Badge>
                <Badge variant="secondary">#outdoor</Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  1.2k
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  456
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  89
                </span>
              </div>
            </TableCell>
            <TableCell>2024-01-15</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-500 rounded flex items-center justify-center text-white text-xs">
                  🎥
                </div>
                <div>
                  <div className="font-medium">Workout Tutorial</div>
                  <div className="text-sm text-muted-foreground">video_002.mp4</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">Video</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Badge variant="secondary">#tutorial</Badge>
                <Badge variant="secondary">#fitness</Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  2.8k
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  892
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  156
                </span>
              </div>
            </TableCell>
            <TableCell>2024-01-14</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Checkbox />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center text-white text-xs">
                  📄
                </div>
                <div>
                  <div className="font-medium">Blog Post Draft</div>
                  <div className="text-sm text-muted-foreground">post_003.md</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">Document</Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <Badge variant="secondary">#blog</Badge>
                <Badge variant="secondary">#lifestyle</Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  567
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  123
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  34
                </span>
              </div>
            </TableCell>
            <TableCell>2024-01-13</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const WithSorting: Story = {
  render: () => (
    <div className="w-[700px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" className="h-auto p-0 font-medium">
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="h-auto p-0 font-medium">
                Size
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="h-auto p-0 font-medium">
                Modified
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="h-auto p-0 font-medium">
                Views
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">content_001.jpg</TableCell>
            <TableCell>2.4 MB</TableCell>
            <TableCell>2024-01-15</TableCell>
            <TableCell>1,234</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">video_tutorial.mp4</TableCell>
            <TableCell>45.7 MB</TableCell>
            <TableCell>2024-01-14</TableCell>
            <TableCell>2,567</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">blog_post.md</TableCell>
            <TableCell>12.3 KB</TableCell>
            <TableCell>2024-01-13</TableCell>
            <TableCell>890</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const AnalyticsTable: Story = {
  render: () => (
    <div className="w-[800px]">
      <Table>
        <TableCaption>Performance analytics for the last 30 days.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead className="text-right">Posts</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Engagement</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Growth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Instagram</TableCell>
            <TableCell className="text-right">24</TableCell>
            <TableCell className="text-right">45,670</TableCell>
            <TableCell className="text-right">8.4%</TableCell>
            <TableCell className="text-right">$1,234</TableCell>
            <TableCell className="text-right">
              <Badge variant="success">+12.5%</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">TikTok</TableCell>
            <TableCell className="text-right">18</TableCell>
            <TableCell className="text-right">89,340</TableCell>
            <TableCell className="text-right">12.1%</TableCell>
            <TableCell className="text-right">$892</TableCell>
            <TableCell className="text-right">
              <Badge variant="success">+24.8%</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">YouTube</TableCell>
            <TableCell className="text-right">6</TableCell>
            <TableCell className="text-right">23,450</TableCell>
            <TableCell className="text-right">15.7%</TableCell>
            <TableCell className="text-right">$2,156</TableCell>
            <TableCell className="text-right">
              <Badge variant="warning">-2.3%</Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Twitter</TableCell>
            <TableCell className="text-right">32</TableCell>
            <TableCell className="text-right">12,890</TableCell>
            <TableCell className="text-right">5.2%</TableCell>
            <TableCell className="text-right">$345</TableCell>
            <TableCell className="text-right">
              <Badge variant="destructive">-8.1%</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const FileManager: Story = {
  render: () => (
    <div className="w-[900px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>📁</TableCell>
            <TableCell className="font-medium">Photos</TableCell>
            <TableCell>—</TableCell>
            <TableCell>Folder</TableCell>
            <TableCell>2024-01-15</TableCell>
            <TableCell>
              <Badge variant="outline">156 items</Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>📁</TableCell>
            <TableCell className="font-medium">Videos</TableCell>
            <TableCell>—</TableCell>
            <TableCell>Folder</TableCell>
            <TableCell>2024-01-14</TableCell>
            <TableCell>
              <Badge variant="outline">89 items</Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>🖼️</TableCell>
            <TableCell className="font-medium">profile_pic.jpg</TableCell>
            <TableCell>2.4 MB</TableCell>
            <TableCell>JPEG Image</TableCell>
            <TableCell>2024-01-13</TableCell>
            <TableCell>
              <Badge variant="success">Published</Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>🎥</TableCell>
            <TableCell className="font-medium">workout_video.mp4</TableCell>
            <TableCell>45.7 MB</TableCell>
            <TableCell>MP4 Video</TableCell>
            <TableCell>2024-01-12</TableCell>
            <TableCell>
              <Badge variant="warning">Processing</Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>📄</TableCell>
            <TableCell className="font-medium">content_plan.pdf</TableCell>
            <TableCell>1.2 MB</TableCell>
            <TableCell>PDF Document</TableCell>
            <TableCell>2024-01-11</TableCell>
            <TableCell>
              <Badge variant="outline">Draft</Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Content</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="h-24 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl">📭</div>
              <p className="text-muted-foreground">No content found</p>
              <p className="text-sm text-muted-foreground">
                Upload your first content to get started
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
