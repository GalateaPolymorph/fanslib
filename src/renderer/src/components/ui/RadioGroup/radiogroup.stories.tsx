import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Label } from "../Label";
import { RadioGroup, RadioGroupItem } from "./index";

const meta: Meta<typeof RadioGroup> = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="option2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithoutDefault: Story = {
  render: () => (
    <RadioGroup>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="r1" />
        <Label htmlFor="r1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="r2" />
        <Label htmlFor="r2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="r3" />
        <Label htmlFor="r3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="d1" />
        <Label htmlFor="d1">Option 1 (Selected)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="d2" />
        <Label htmlFor="d2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="d3" />
        <Label htmlFor="d3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="basic" className="space-y-4">
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="basic" id="basic" className="mt-1" />
        <div className="space-y-1">
          <Label htmlFor="basic">Basic Plan</Label>
          <p className="text-sm text-muted-foreground">
            Perfect for getting started with essential features.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="pro" id="pro" className="mt-1" />
        <div className="space-y-1">
          <Label htmlFor="pro">Pro Plan</Label>
          <p className="text-sm text-muted-foreground">
            Advanced features for growing teams and businesses.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="enterprise" id="enterprise" className="mt-1" />
        <div className="space-y-1">
          <Label htmlFor="enterprise">Enterprise Plan</Label>
          <p className="text-sm text-muted-foreground">
            Custom solutions with dedicated support and advanced security.
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string>("");

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">Selected: {value || "None"}</div>
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="react" id="react" />
            <Label htmlFor="react">React</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vue" id="vue" />
            <Label htmlFor="vue">Vue</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="angular" id="angular" />
            <Label htmlFor="angular">Angular</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="svelte" id="svelte" />
            <Label htmlFor="svelte">Svelte</Label>
          </div>
        </RadioGroup>
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const [size, setSize] = useState("medium");
    const [color, setColor] = useState("blue");
    const [delivery, setDelivery] = useState("standard");

    return (
      <div className="space-y-6 w-[400px]">
        <div>
          <h3 className="text-lg font-medium mb-4">Product Options</h3>

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Size</Label>
              <RadioGroup value={size} onValueChange={setSize} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small">Small - $19.99</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium - $24.99</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Large - $29.99</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Color</Label>
              <RadioGroup value={color} onValueChange={setColor} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blue" id="blue" />
                  <Label htmlFor="blue">Blue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="red" id="red" />
                  <Label htmlFor="red">Red</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="green" id="green" />
                  <Label htmlFor="green">Green</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="black" id="black" />
                  <Label htmlFor="black">Black</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Delivery</Label>
              <RadioGroup value={delivery} onValueChange={setDelivery} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard (5-7 days) - Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express">Express (2-3 days) - $9.99</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="overnight" id="overnight" />
                  <Label htmlFor="overnight">Overnight - $19.99</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground">
            <p>
              Selected: {size} size, {color} color, {delivery} delivery
            </p>
          </div>
        </div>
      </div>
    );
  },
};

export const PaymentMethods: Story = {
  render: () => (
    <div className="space-y-4 w-[350px]">
      <div>
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        <RadioGroup defaultValue="card" className="space-y-3">
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="card" id="card" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="card">Credit Card</Label>
              <p className="text-sm text-muted-foreground">
                Pay with Visa, Mastercard, or American Express
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="paypal">PayPal</Label>
              <p className="text-sm text-muted-foreground">Pay securely with your PayPal account</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="apple" id="apple" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="apple">Apple Pay</Label>
              <p className="text-sm text-muted-foreground">
                Quick and secure payment with Touch ID or Face ID
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="google" id="google" className="mt-1" />
            <div className="space-y-1">
              <Label htmlFor="google">Google Pay</Label>
              <p className="text-sm text-muted-foreground">Pay with your Google account</p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};

export const Survey: Story = {
  render: () => (
    <div className="space-y-6 w-[400px]">
      <div>
        <h3 className="text-lg font-medium mb-4">Customer Survey</h3>

        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">How satisfied are you with our service?</Label>
            <RadioGroup className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-satisfied" id="very-satisfied" />
                <Label htmlFor="very-satisfied">Very Satisfied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="satisfied" id="satisfied" />
                <Label htmlFor="satisfied">Satisfied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dissatisfied" id="dissatisfied" />
                <Label htmlFor="dissatisfied">Dissatisfied</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-dissatisfied" id="very-dissatisfied" />
                <Label htmlFor="very-dissatisfied">Very Dissatisfied</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">How likely are you to recommend us?</Label>
            <RadioGroup className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-likely" id="very-likely" />
                <Label htmlFor="very-likely">Very Likely</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="likely" id="likely" />
                <Label htmlFor="likely">Likely</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unlikely" id="unlikely" />
                <Label htmlFor="unlikely">Unlikely</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-unlikely" id="very-unlikely" />
                <Label htmlFor="very-unlikely">Very Unlikely</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  ),
};
