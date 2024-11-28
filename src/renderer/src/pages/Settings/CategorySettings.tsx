import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { Palette, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CATEGORY_COLORS } from "../../../../lib/database/categories/colors";
import { Category } from "../../../../lib/database/categories/type";

export const CategorySettings: React.FC = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    window.api.category.getAllCategories().then(setCategories);
  }, []);

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      const newCategory = await window.api.category.createCategory(categoryName);
      setCategories((prev) => [...prev, newCategory]);
      setCategoryName("");
    } catch (error) {
      console.error("Failed to create category", error);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    try {
      await window.api.category.deleteCategory(slug);
      setCategories((prev) => prev.filter((cat) => cat.slug !== slug));
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const handleUpdateColor = async (slug: string, color: string) => {
    try {
      await window.api.category.updateCategory(slug, { color });
      setCategories((prev) => prev.map((cat) => (cat.slug === slug ? { ...cat, color } : cat)));
    } catch (error) {
      console.error("Failed to update category color", error);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-lg font-medium">Categories</h3>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Add a category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
          />
          <Button onClick={handleCreateCategory}>Create</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.slug}
              style={{ backgroundColor: category.color }}
              className="text-white group flex items-center py-1"
            >
              <span className="mr-2">{category.name}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-white/20 rounded-full"
                  >
                    <Palette className="h-2 w-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <div className="grid grid-cols-5 gap-1">
                    {CATEGORY_COLORS.map((color) => (
                      <Button
                        key={color}
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 rounded-full hover:ring-1 hover:ring-accent-foreground transition-all"
                        style={{ backgroundColor: color }}
                        onClick={() => handleUpdateColor(category.slug, color)}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-white/20 rounded-full"
                onClick={() => handleDeleteCategory(category.slug)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
