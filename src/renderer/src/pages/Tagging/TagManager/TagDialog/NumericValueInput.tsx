import { useEffect, useState } from "react";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { NumericSchema } from "../../../../lib/tagValidation";

type NumericValueInputProps = {
  value: number;
  onChange: (value: number) => void;
  schema: NumericSchema;
  onValidationChange?: (error: string | null) => void;
};

export const NumericValueInput = ({
  value,
  onChange,
  schema,
  onValidationChange,
}: NumericValueInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const validateAndUpdate = (newValue: string) => {
    const numericValue = parseFloat(newValue);

    if (newValue === "" || isNaN(numericValue)) {
      const errorMsg = "Please enter a valid number";
      setError(errorMsg);
      onValidationChange?.(errorMsg);
      return;
    }

    let validationError: string | null = null;

    if (schema.min !== undefined && numericValue < schema.min) {
      validationError = `Value must be at least ${schema.min}`;
    } else if (schema.max !== undefined && numericValue > schema.max) {
      validationError = `Value must be at most ${schema.max}`;
    } else if (schema.step !== undefined && schema.min !== undefined) {
      const remainder = (numericValue - schema.min) % schema.step;
      if (Math.abs(remainder) > 0.0001) {
        validationError = `Value must be in steps of ${schema.step}`;
      }
    }

    setError(validationError);
    onValidationChange?.(validationError);

    if (!validationError) {
      onChange(numericValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    validateAndUpdate(newValue);
  };

  const getPlaceholder = () => {
    if (schema.min !== undefined && schema.max !== undefined) {
      return `Enter value between ${schema.min} and ${schema.max}`;
    }
    if (schema.min !== undefined) {
      return `Enter value (min: ${schema.min})`;
    }
    if (schema.max !== undefined) {
      return `Enter value (max: ${schema.max})`;
    }
    return "Enter numeric value";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="numericValue">
        Value *{schema.unit && <span className="text-gray-500 ml-1">({schema.unit})</span>}
      </Label>
      <Input
        id="numericValue"
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={getPlaceholder()}
        min={schema.min}
        max={schema.max}
        step={schema.step}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {schema.min !== undefined || schema.max !== undefined ? (
        <p className="text-xs text-gray-500">
          Range: {schema.min ?? "−∞"} to {schema.max ?? "∞"}
          {schema.step && ` (step: ${schema.step})`}
        </p>
      ) : null}
    </div>
  );
};
