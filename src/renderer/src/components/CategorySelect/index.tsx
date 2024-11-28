import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { Category } from "../../../../lib/database/categories/type";
import "./styles.css";

interface CategorySelectProps {
  value?: string[];
  onChange: (categorySlugs: string[]) => void;
}

type SelectOption = {
  label: string;
  value: string;
  color?: string;
};

export const CategorySelect = ({ value = [], onChange }: CategorySelectProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<SelectOption[]>([]);

  useEffect(() => {
    window.api.category.getAllCategories().then((cats) => {
      setCategories(cats);
    });
  }, []);

  useEffect(() => {
    const selectedOptions = categories
      .filter((cat) => value.includes(cat.slug))
      .map((cat) => ({
        label: cat.name,
        value: cat.slug,
        color: cat.color,
      }));
    setSelected(selectedOptions);
  }, [value, categories]);

  const options = categories.map((cat) => ({
    label: cat.name,
    value: cat.slug,
    color: cat.color,
  }));

  const handleChange = (options: SelectOption[]) => {
    onChange(options.map((opt) => opt.value));
  };

  return (
    <div className="w-full">
      <MultiSelect
        options={options}
        value={selected}
        onChange={handleChange}
        labelledBy="Select categories"
        hasSelectAll={false}
        className="category-multi-select"
        closeOnChangedValue
        valueRenderer={(selected) => {
          if (selected.length === 0) return "Select categories...";
          return selected.map((option: SelectOption) => (
            <span
              key={option.value}
              className="inline-flex items-center gap-1 px-2 py-0.5 m-0.5 rounded-full text-sm text-white"
              style={{ backgroundColor: option.color } as React.CSSProperties}
            >
              {option.label}
              <button
                className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-white/30 bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange(selected.filter((opt) => opt.value !== option.value));
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ));
        }}
        ItemRenderer={({ checked, option, onClick }) => (
          <div
            className={`flex items-center p-2 cursor-pointer ${
              checked ? "bg-[--rmsc-selected]" : "hover:bg-[--rmsc-hover]"
            }`}
            onClick={onClick}
          >
            <span
              className="w-3 h-3 mr-2 rounded-full"
              style={{ backgroundColor: (option as SelectOption).color }}
            />
            <span>{option.label}</span>
          </div>
        )}
      />
    </div>
  );
};
