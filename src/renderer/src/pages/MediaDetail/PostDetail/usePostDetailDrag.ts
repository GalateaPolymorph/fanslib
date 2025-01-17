import { useToast } from "@renderer/components/ui/use-toast";
import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
import { useRef, useState } from "react";
import { Post } from "../../../../../features/posts/entity";
import { VirtualPost, isVirtualPost } from "../../../lib/virtual-posts";

type UsePostDetailDragProps = {
  post: Post | VirtualPost;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdate: () => Promise<void>;
};

export const usePostDetailDrag = ({
  post,
  isOpen,
  onOpenChange,
  onUpdate,
}: UsePostDetailDragProps) => {
  const { toast } = useToast();
  const { draggedMedias, endMediaDrag, isDragging } = useMediaDrag();
  const wasClosedRef = useRef(false);
  const dragEnterCountRef = useRef(0);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && draggedMedias.length > 0) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setIsDraggedOver(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && draggedMedias.length > 0) {
      e.preventDefault();
      dragEnterCountRef.current++;
      if (dragEnterCountRef.current === 1) {
        wasClosedRef.current = !isOpen;
        onOpenChange(true);
        setIsDraggedOver(true);
      }
    }
  };

  const handleDragLeave = (_: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && draggedMedias.length > 0) {
      dragEnterCountRef.current--;
      if (dragEnterCountRef.current === 0) {
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
        await window.api["post:create"](
          {
            date: post.date,
            categoryId: post.categoryId,
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
