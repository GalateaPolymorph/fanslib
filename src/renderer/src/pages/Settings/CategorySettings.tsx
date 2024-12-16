import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { Palette, X } from "lucide-react";
import { useState } from "react";
import { CATEGORY_COLORS } from "../../../../features/categories/colors";
import { useCategories } from "../../contexts/CategoryContext";

export const CategorySettings = () => {
  const [categoryName, setCategoryName] = useState("");
  const { categories, refetch } = useCategories();

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      await window.api["category:create"](categoryName);
      refetch();
      setCategoryName("");
    } catch (error) {
      console.error("Failed to create category", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await window.api["category:delete"](id);
      refetch();
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const handleUpdateColor = async (id: string, color: string) => {
    try {
      await window.api["category:update"](id, { color });
      refetch();
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
              key={category.id}
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
                        onClick={() => handleUpdateColor(category.id, color)}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-white/20 rounded-full"
                onClick={() => handleDeleteCategory(category.id)}
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
