import { useCallback, useEffect, useRef, useState } from "react";
import { Post } from "../../../../features/posts/entity";
import { useUpdatePost } from "../api/usePost";

type UseFieldUpdateProps<T> = {
  post: Post | undefined;
  fieldName: keyof Post;
  transform?: (value: T) => any;
  debounceMs?: number;
};

export const useFieldUpdate = <T>({
  post,
  fieldName,
  transform = (v) => v,
  debounceMs = 500,
}: UseFieldUpdateProps<T>) => {
  const [pendingValue, setPendingValue] = useState<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { mutateAsync: updatePost, isPending } = useUpdatePost();

  // Cleanup timeout on unmount or post change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset pending value when post changes
  useEffect(() => {
    setPendingValue(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [post?.id]);

  const updateField = useCallback(
    (value: T) => {
      if (!post) return;

      // Set pending value for immediate UI feedback
      setPendingValue(value);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced update
      timeoutRef.current = setTimeout(async () => {
        try {
          const transformedValue = transform(value);

          // Skip update if value hasn't actually changed
          if (transformedValue === post[fieldName]) {
            setPendingValue(null);
            return;
          }

          await updatePost({
            postId: post.id,
            updates: { [fieldName]: transformedValue },
          });

          setPendingValue(null);
        } catch (error) {
          console.error(`Failed to update ${String(fieldName)}:`, error);
          setPendingValue(null);
        }
      }, debounceMs);
    },
    [post, fieldName, transform, debounceMs, updatePost]
  );

  const getCurrentValue = useCallback(() => {
    if (!post) return undefined;
    return pendingValue !== null ? pendingValue : (post[fieldName] as T);
  }, [post, fieldName, pendingValue]);

  const isUpdating = isPending || pendingValue !== null;

  return {
    updateField,
    getCurrentValue,
    isUpdating,
    hasPendingChanges: pendingValue !== null,
  };
};
