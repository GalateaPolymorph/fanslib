import { useLibrary } from "@renderer/contexts/LibraryContext";
import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
import { useAddMediaToPost, useCreatePost } from "@renderer/hooks/api/usePost";
import { STORAGE_KEYS, useLocalStorageState } from "@renderer/lib/local-storage";
import { VirtualPost, isVirtualPost } from "@renderer/lib/virtual-posts";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "src/features/posts/entity";

type UsePostPreviewDragProps = {
  post: Post | VirtualPost;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdate: () => Promise<void>;
};

export const usePostPreviewDrag = ({
  post,
  isOpen,
  onOpenChange,
  onUpdate,
}: UsePostPreviewDragProps) => {
  const { refetch } = useLibrary();
  const navigate = useNavigate();
  const { draggedMedias, endMediaDrag, isDragging } = useMediaDrag();
  const wasClosedRef = useRef(false);
  const dragEnterCountRef = useRef(0);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [shouldRedirect] = useLocalStorageState(STORAGE_KEYS.REDIRECT_TO_POST_DETAIL, true);
  const createPostMutation = useCreatePost();
  const addMediaMutation = useAddMediaToPost();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isDragging && draggedMedias.length > 0) {
      e.dataTransfer.dropEffect = "copy";
      setIsDraggedOver(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && draggedMedias.length > 0) {
      const relatedTarget = e.relatedTarget as Node | null;
      if (!e.currentTarget.contains(relatedTarget)) {
        dragEnterCountRef.current++;
        if (dragEnterCountRef.current === 1) {
          wasClosedRef.current = !isOpen;
          onOpenChange(true);
          setIsDraggedOver(true);
        }
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && draggedMedias.length > 0) {
      const relatedTarget = e.relatedTarget as Node | null;
      if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
        dragEnterCountRef.current = 0;
        if (wasClosedRef.current) {
          onOpenChange(false);
        }
        setIsDraggedOver(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragEnterCountRef.current = 0;
    setIsDraggedOver(false);
    if (wasClosedRef.current) {
      onOpenChange(false);
    }

    if (!isDragging) return;

    try {
      if (isVirtualPost(post)) {
        const newPost = await createPostMutation.mutateAsync({
          postData: {
            date: post.date,
            channelId: post.channelId,
            status: "draft",
            caption: "",
          },
          mediaIds: draggedMedias.map((media) => media.id),
        });
        await onUpdate();
        endMediaDrag();
        refetch();

        if (shouldRedirect) {
          navigate(`/posts/${newPost.id}`);
        }
        return;
      }

      await addMediaMutation.mutateAsync({
        postId: post.id,
        mediaIds: draggedMedias.map((media) => media.id),
      });
      await onUpdate();
      endMediaDrag();
      refetch();
    } catch (error) {
      console.error("Failed to add media to post:", error);
    } finally {
      setIsDraggedOver(false);
      if (wasClosedRef.current) {
        onOpenChange(false);
      }
    }
  };

  return {
    isDragging,
    isDraggedOver,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
};
