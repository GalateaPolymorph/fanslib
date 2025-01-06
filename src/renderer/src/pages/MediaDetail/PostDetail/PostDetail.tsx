import { Accordion, AccordionContent, AccordionItem } from "@renderer/components/ui/accordion";
import { useToast } from "@renderer/components/ui/use-toast";
import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
import { useRef } from "react";
import { Post } from "../../../../../features/posts/entity";
import { PostDetailCaptionInput } from "./PostDetailCaptionInput";
import { PostDetailDateInput } from "./PostDetailDateInput";
import { PostDetailDeleteButton } from "./PostDetailDeleteButton";
import { PostDetailHead } from "./PostDetailHead";
import { PostDetailMedia } from "./PostDetailMedia";
import { PostDetailStatusButton } from "./PostDetailStatusButton";

type PostDetailProps = {
  post: Post;
  onUpdate: () => Promise<void>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const PostDetail = ({ post, onUpdate, isOpen, onOpenChange }: PostDetailProps) => {
  const { toast } = useToast();
  const { isDragging, draggedMedia, handleDragEnd } = useMediaDrag();
  const wasClosedRef = useRef(false);
  const dragEnterCountRef = useRef(0);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && draggedMedia) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && draggedMedia) {
      e.preventDefault();
      dragEnterCountRef.current++;
      if (dragEnterCountRef.current === 1) {
        wasClosedRef.current = !isOpen;
        onOpenChange(true);
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (isDragging && draggedMedia) {
      dragEnterCountRef.current--;
      // Only close when we've left the outermost element
      if (dragEnterCountRef.current === 0 && wasClosedRef.current) {
        onOpenChange(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragEnterCountRef.current = 0;
    if (draggedMedia) {
      try {
        await window.api["post:addMedia"](post.id, [draggedMedia.id]);
        await onUpdate();
        toast({
          title: "Media added to post",
        });
      } catch (error) {
        console.error("Failed to add media to post:", error);
        toast({
          title: "Failed to add media to post",
          variant: "destructive",
        });
      } finally {
        handleDragEnd();
        // Reset wasClosedRef after drop
        wasClosedRef.current = false;
      }
    }
  };

  return (
    <Accordion
      type="single"
      value={isOpen ? "item-1" : ""}
      onValueChange={(value) => onOpenChange(!!value)}
    >
      <AccordionItem
        value="item-1"
        className="border rounded-md"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <PostDetailHead post={post} isOpen={isOpen} setIsOpen={onOpenChange} />
        <AccordionContent className="px-4" onDragOver={handleDragOver} onDrop={handleDrop}>
          <div className="flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <PostDetailMedia
              post={post}
              onUpdate={onUpdate}
              isDraggingMedia={isDragging && isOpen}
            />
            <PostDetailCaptionInput post={post} onUpdate={onUpdate} />
            <div className="@container">
              <div className="flex flex-col-reverse @[600px]:flex-row justify-between gap-2">
                <PostDetailDeleteButton post={post} onUpdate={onUpdate} />
                <div className="flex flex-col @[600px]:flex-row gap-2">
                  <PostDetailDateInput post={post} onUpdate={onUpdate} />
                  <PostDetailStatusButton post={post} onUpdate={onUpdate} />
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
