import { useState } from "react";
import { NumericSchema } from "../../lib/tagValidation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

type NumericDimensionConfigProps = {
  schema: NumericSchema;
  onChange: (schema: NumericSchema) => void;
};

export const NumericDimensionConfig = ({ schema, onChange }: NumericDimensionConfigProps) => {
  const [min, setMin] = useState(schema.min ?? 0);
  const [max, setMax] = useState(schema.max ?? 100);
  const [step, setStep] = useState(schema.step ?? 1);
  const [unit, setUnit] = useState(schema.unit || "");
  const [defaultValue, setDefaultValue] = useState(schema.defaultValue ?? schema.min ?? 0);

  const updateSchema = (updates: Partial<NumericSchema>) => {
    const newSchema = { ...schema, ...updates };
    onChange(newSchema);
  };

  const handleMinChange = (value: number) => {
    setMin(value);
    if (defaultValue < value) {
      setDefaultValue(value);
      updateSchema({ min: value, defaultValue: value });
    } else {
      updateSchema({ min: value });
    }
  };

  const handleMaxChange = (value: number) => {
    setMax(value);
    if (defaultValue > value) {
      setDefaultValue(value);
      updateSchema({ max: value, defaultValue: value });
    } else {
      updateSchema({ max: value });
    }
  };

  const handleStepChange = (value: number) => {
    setStep(value);
    updateSchema({ step: value });
  };

  const handleUnitChange = (value: string) => {
    setUnit(value);
    updateSchema({ unit: value });
  };

  const handleDefaultValueChange = (value: number) => {
    setDefaultValue(value);
    updateSchema({ defaultValue: value });
  };

  // Generate tick marks for visualization
  const generateTicks = () => {
    const ticks = [];
    const range = max - min;
    const tickCount = Math.min(10, Math.floor(range / step) + 1);
    const tickStep = range / (tickCount - 1);

    for (let i = 0; i < tickCount; i++) {
      const value = min + i * tickStep;
      ticks.push(Math.round(value / step) * step);
    }
    return ticks;
  };

  const ticks = generateTicks();
  const range = max - min;
  const defaultPosition = range > 0 ? ((defaultValue - min) / range) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Numeric Configuration</CardTitle>
        <CardDescription>
          Configure the range, step size, and unit for numeric values. Tags will be created based on
          these constraints.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min">Minimum Value</Label>
            <Input
              id="min"
              type="number"
              value={min}
              onChange={(e) => handleMinChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max">Maximum Value</Label>
            <Input
              id="max"
              type="number"
              value={max}
              onChange={(e) => handleMaxChange(parseFloat(e.target.value) || 100)}
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="step">Step Size</Label>
            <Input
              id="step"
              type="number"
              value={step}
              onChange={(e) => handleStepChange(parseFloat(e.target.value) || 1)}
              placeholder="1"
              min="0.01"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit (Optional)</Label>
          <Input
            id="unit"
            value={unit}
            onChange={(e) => handleUnitChange(e.target.value)}
            placeholder="e.g., %, seconds, MB, points"
          />
        </div>

        <div className="space-y-4">
          <Label>Default Value</Label>
          <div className="px-3">
            <Slider
              value={[defaultValue]}
              onValueChange={([value]) => handleDefaultValueChange(value)}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>
                {min}
                {unit && ` ${unit}`}
              </span>
              <span className="font-medium text-gray-900">
                {defaultValue}
                {unit && ` ${unit}`}
              </span>
              <span>
                {max}
                {unit && ` ${unit}`}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Range Visualization:</strong>
          </p>

          {/* Timeline/Bar Visualization */}
          <div className="relative">
            {/* Main bar */}
            <div className="h-8 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 rounded-md relative overflow-hidden">
              {/* Default value indicator */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-lg"
                style={{ left: `${defaultPosition}%` }}
              />
              <div
                className="absolute -top-6 text-xs font-medium text-red-600 transform -translate-x-1/2"
                style={{ left: `${defaultPosition}%` }}
              >
                Default
              </div>
            </div>

            {/* Tick marks */}
            <div className="flex justify-between mt-2">
              {ticks.map((tick, index) => (
                <div key={index} className="text-xs text-gray-500 text-center">
                  <div className="w-px h-2 bg-gray-400 mx-auto mb-1" />
                  {tick}
                  {unit && ` ${unit}`}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-600">
            <p>
              • Range: {min} to {max}
              {unit && ` ${unit}`}
            </p>
            <p>
              • Step: {step}
              {unit && ` ${unit}`}
            </p>
            <p>• Possible values: {Math.floor((max - min) / step) + 1}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
