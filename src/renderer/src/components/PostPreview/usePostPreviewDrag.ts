import { useToast } from "@renderer/components/ui/use-toast";
import { useLibrary } from "@renderer/contexts/LibraryContext";
import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
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
  const { toast } = useToast();
  const navigate = useNavigate();
  const { draggedMedias, endMediaDrag, isDragging } = useMediaDrag();
  const wasClosedRef = useRef(false);
  const dragEnterCountRef = useRef(0);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [shouldRedirect] = useLocalStorageState(STORAGE_KEYS.REDIRECT_TO_POST_DETAIL, true);

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
        const newPost = await window.api["post:create"](
          {
            date: post.date,
            channelId: post.channelId,
            status: "draft",
            caption: "",
          },
          draggedMedias.map((media) => media.id)
        );
        await onUpdate();
        toast({
          title: "Post created",
        });
        endMediaDrag();
        refetch();

        if (shouldRedirect) {
          navigate(`/posts/${newPost.id}`);
        }
        return;
      }

      await window.api["post:addMedia"](
        post.id,
        draggedMedias.map((media) => media.id)
      );
      await onUpdate();
      toast({
        title:
          draggedMedias.length === 1
            ? "Media added to post"
            : `${draggedMedias.length} media items added to post`,
      });
      endMediaDrag();
      refetch();
    } catch (error) {
      console.error("Failed to add media to post:", error);
      toast({
        title: "Failed to add media to post",
        variant: "destructive",
      });
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
