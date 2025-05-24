import { useEffect, useRef } from "react";
import { Post } from "../../../../features/posts/entity";
import { useDebouncedPostUpdate } from "../api/usePost";
import { useDebounce } from "../ui/useDebounce";

type UseDebouncedFieldUpdateProps<T> = {
  post: Post | undefined;
  value: T;
  fieldName: keyof Post;
  debounceMs?: number;
  transform?: (value: T) => any;
};

export const useDebouncedFieldUpdate = <T>({
  post,
  value,
  fieldName,
  debounceMs = 500,
  transform = (v) => v,
}: UseDebouncedFieldUpdateProps<T>) => {
  const debouncedValue = useDebounce(value, debounceMs);
  const { updateField, isUpdating, error } = useDebouncedPostUpdate(post);
  const currentPostIdRef = useRef<string | undefined>(post?.id);
  const lastUpdateRef = useRef<T | undefined>(undefined);
  const initialValueRef = useRef<T | undefined>(undefined);

  // Track current post ID and reset on post change
  useEffect(() => {
    currentPostIdRef.current = post?.id;
    lastUpdateRef.current = undefined;
    initialValueRef.current = value; // Store initial value
  }, [post?.id, value]);

  // Handle debounced updates
  useEffect(() => {
    const performUpdate = async () => {
      if (!post) return;

      // Ignore updates from previous posts
      if (currentPostIdRef.current !== post.id) {
        return;
      }

      // Skip if this is the initial value or if value hasn't changed since last update
      if (debouncedValue === initialValueRef.current || lastUpdateRef.current === debouncedValue) {
        return;
      }

      const transformedValue = transform(debouncedValue);
      const currentValue = post[fieldName];

      // Skip if the transformed value equals current value
      if (transformedValue === currentValue) {
        return;
      }

      try {
        lastUpdateRef.current = debouncedValue;
        await updateField({ [fieldName]: transformedValue });
      } catch (err) {
        // Reset the last update ref on error so we can retry
        lastUpdateRef.current = undefined;
        throw err;
      }
    };

    // Only run if we have a post and the debounced value has been set
    if (post?.id && debouncedValue !== undefined) {
      performUpdate();
    }
  }, [debouncedValue, post, fieldName, transform, updateField]);

  return {
    isUpdating,
    error,
    updateField,
  };
};
