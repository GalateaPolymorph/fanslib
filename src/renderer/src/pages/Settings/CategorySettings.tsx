import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@renderer/components/ui/popover";
import { Check, Palette, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CATEGORY_COLORS } from "../../../../features/categories/colors";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../hooks/api/useCategories";

export const CategorySettings = () => {
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const { data: categories = [] } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    try {
      await createCategoryMutation.mutateAsync(categoryName);
      setCategoryName("");
    } catch (error) {
      console.error("Failed to create category", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete category", error);
    }
  };

  const handleUpdateColor = async (id: string, color: string) => {
    try {
      await updateCategoryMutation.mutateAsync({ categoryId: id, updates: { color } });
    } catch (error) {
      console.error("Failed to update category color", error);
    }
  };

  const handleUpdateName = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    try {
      await updateCategoryMutation.mutateAsync({
        categoryId: editingCategory.id,
        updates: { name: editingCategory.name },
      });
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to update category name", error);
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
            <div
              key={category.id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center flex-1">
                {editingCategory?.id === category.id ? (
                  <div className="flex items-center flex-1">
                    <Input
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, name: e.target.value })
                      }
                      className="h-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleUpdateName}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge
                      variant="outline"
                      className="font-normal"
                      style={{ borderColor: category.color, color: category.color }}
                    >
                      {category.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
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
                              className="h-6 w-6 p-0 hover:ring-1 hover:ring-accent-foreground transition-all"
                              style={{ backgroundColor: color }}
                              onClick={() => handleUpdateColor(category.id, color)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
