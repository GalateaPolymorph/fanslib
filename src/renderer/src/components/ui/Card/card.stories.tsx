import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./index";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="p-6">
        <p>A simple card with just content.</p>
      </CardContent>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="notifications" />
            <label htmlFor="notifications">Enable notifications</label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="marketing" />
            <label htmlFor="marketing">Receive marketing emails</label>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px]">
      <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
      <CardHeader>
        <CardTitle>Beautiful Gradient</CardTitle>
        <CardDescription>A card with a visual header element.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card demonstrates how to include visual elements like images or gradients.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Premium Plan</CardTitle>
        <CardDescription>Everything you need for your business</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          $29<span className="text-sm font-normal">/month</span>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Unlimited projects
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Priority support
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Advanced analytics
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatCard: Story = {
  render: () => (
    <Card className="w-[200px]">
      <CardHeader className="pb-2">
        <CardDescription>Total Users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">10,234</div>
        <p className="text-xs text-muted-foreground">+12% from last month</p>
      </CardContent>
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>View your performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">89%</div>
          <p className="text-xs text-muted-foreground">Conversion rate</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Monthly revenue overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231</div>
          <p className="text-xs text-muted-foreground">+23% from last month</p>
        </CardContent>
      </Card>
    </div>
  ),
};
