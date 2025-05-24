import { useToast } from "@renderer/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "../../../../features/categories/entity";

// Query keys
export const categoryKeys = {
  all: ["categories"] as const,
  byId: (id: string) => ["categories", id] as const,
};

// Fetch all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const categories = await window.api["category:getAll"]();
      return categories;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Create category mutation
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (categoryName: string) => {
      const result = await window.api["category:create"](categoryName);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast({
        title: "Category created successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create category",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Update category mutation
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      categoryId,
      updates,
    }: {
      categoryId: string;
      updates: Partial<Category>;
    }) => {
      const result = await window.api["category:update"](categoryId, updates);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast({
        title: "Category updated successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update category",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};

// Delete category mutation
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      await window.api["category:delete"](categoryId);
      return categoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast({
        title: "Category deleted successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete category",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
};
