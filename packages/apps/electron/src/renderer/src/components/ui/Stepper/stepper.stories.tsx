import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Label } from "../Label";
import { Stepper } from "./index";

const meta: Meta<typeof Stepper> = {
  title: "UI/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    min: {
      control: { type: "number" },
      description: "Minimum value",
    },
    max: {
      control: { type: "number" },
      description: "Maximum value",
    },
    value: {
      control: { type: "number" },
      description: "Current value",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(1);

    return (
      <div className="space-y-4">
        <div>
          <Label>Quantity</Label>
          <Stepper value={value} onChange={setValue} />
        </div>
        <p className="text-sm text-muted-foreground">Current value: {value}</p>
      </div>
    );
  },
};

export const WithRange: Story = {
  render: () => {
    const [value, setValue] = useState(5);

    return (
      <div className="space-y-4">
        <div>
          <Label>Select quantity (1-10)</Label>
          <Stepper value={value} onChange={setValue} min={1} max={10} />
        </div>
        <p className="text-sm text-muted-foreground">Current value: {value}</p>
      </div>
    );
  },
};

export const CustomMinMax: Story = {
  render: () => {
    const [value, setValue] = useState(0);

    return (
      <div className="space-y-4">
        <div>
          <Label>Volume (0-100)</Label>
          <Stepper value={value} onChange={setValue} min={0} max={100} />
        </div>
        <p className="text-sm text-muted-foreground">Current value: {value}</p>
      </div>
    );
  },
};

export const ShoppingCart: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: 1, name: "Wireless Headphones", price: 99.99, quantity: 1 },
      { id: 2, name: "Phone Case", price: 24.99, quantity: 2 },
      { id: 3, name: "Screen Protector", price: 12.99, quantity: 1 },
    ]);

    const updateQuantity = (id: number, quantity: number) => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
      <div className="w-[400px] space-y-4">
        <h3 className="font-semibold">Shopping Cart</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.name}</h4>
                <p className="text-xs text-muted-foreground">${item.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <Stepper
                  value={item.quantity}
                  onChange={(quantity) => updateQuantity(item.id, quantity)}
                  min={1}
                  max={10}
                />
                <div className="text-sm font-medium w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t">
          <span className="font-semibold">Total:</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>
      </div>
    );
  },
};

export const ContentSettings: Story = {
  render: () => {
    const [postFrequency, setPostFrequency] = useState(3);
    const [autoBackup, setAutoBackup] = useState(7);
    const [maxUploads, setMaxUploads] = useState(5);

    return (
      <div className="w-[350px] space-y-6">
        <h3 className="font-semibold">Content Settings</h3>

        <div className="space-y-2">
          <Label>Posts per day</Label>
          <Stepper value={postFrequency} onChange={setPostFrequency} min={1} max={10} />
          <p className="text-xs text-muted-foreground">
            Schedule {postFrequency} post{postFrequency !== 1 ? "s" : ""} per day
          </p>
        </div>

        <div className="space-y-2">
          <Label>Auto-backup interval (days)</Label>
          <Stepper value={autoBackup} onChange={setAutoBackup} min={1} max={30} />
          <p className="text-xs text-muted-foreground">
            Backup library every {autoBackup} day{autoBackup !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Concurrent uploads</Label>
          <Stepper value={maxUploads} onChange={setMaxUploads} min={1} max={10} />
          <p className="text-xs text-muted-foreground">
            Allow up to {maxUploads} simultaneous upload{maxUploads !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    );
  },
};

export const RecipeIngredients: Story = {
  render: () => {
    const [ingredients, setIngredients] = useState([
      { name: "Flour", amount: 2, unit: "cups" },
      { name: "Sugar", amount: 1, unit: "cup" },
      { name: "Eggs", amount: 3, unit: "pieces" },
      { name: "Butter", amount: 4, unit: "tbsp" },
    ]);

    const updateAmount = (index: number, amount: number) => {
      setIngredients((prev) =>
        prev.map((ingredient, i) => (i === index ? { ...ingredient, amount } : ingredient))
      );
    };

    return (
      <div className="w-[300px] space-y-4">
        <h3 className="font-semibold">Recipe Ingredients</h3>
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <span className="text-sm font-medium">{ingredient.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Stepper
                  value={ingredient.amount}
                  onChange={(amount) => updateAmount(index, amount)}
                  min={1}
                  max={20}
                />
                <span className="text-sm text-muted-foreground w-12">{ingredient.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const GameSettings: Story = {
  render: () => {
    const [players, setPlayers] = useState(2);
    const [rounds, setRounds] = useState(5);
    const [difficulty, setDifficulty] = useState(3);

    return (
      <div className="w-[300px] space-y-6">
        <h3 className="font-semibold">Game Configuration</h3>

        <div className="space-y-2">
          <Label>Number of players</Label>
          <Stepper value={players} onChange={setPlayers} min={2} max={8} />
        </div>

        <div className="space-y-2">
          <Label>Rounds to play</Label>
          <Stepper value={rounds} onChange={setRounds} min={1} max={20} />
        </div>

        <div className="space-y-2">
          <Label>Difficulty level</Label>
          <Stepper value={difficulty} onChange={setDifficulty} min={1} max={5} />
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-4 h-2 rounded ${i < difficulty ? "bg-blue-500" : "bg-gray-200"}`}
              />
            ))}
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg text-sm">
          <p>
            <strong>Game Setup:</strong>
          </p>
          <p>
            {players} players, {rounds} rounds
          </p>
          <p>Difficulty: {difficulty}/5</p>
        </div>
      </div>
    );
  },
};

export const AtBoundaries: Story = {
  render: () => {
    const [minValue, setMinValue] = useState(1);
    const [maxValue, setMaxValue] = useState(10);

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>At minimum (1)</Label>
          <Stepper value={minValue} onChange={setMinValue} min={1} max={10} />
          <p className="text-xs text-muted-foreground">Decrement button is disabled</p>
        </div>

        <div className="space-y-2">
          <Label>At maximum (10)</Label>
          <Stepper value={maxValue} onChange={setMaxValue} min={1} max={10} />
          <p className="text-xs text-muted-foreground">Increment button is disabled</p>
        </div>
      </div>
    );
  },
};
