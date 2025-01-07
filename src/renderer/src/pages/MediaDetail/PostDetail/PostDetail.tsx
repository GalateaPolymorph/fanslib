import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion";
import { useToast } from "@renderer/components/ui/use-toast";
import { useMediaDrag } from "@renderer/contexts/MediaDragContext";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Post } from "../../../../../features/posts/entity";
import { cn } from "../../../lib/utils";
import { isVirtualPost, VirtualPost } from "../../../lib/virtual-posts";
import { PostDetailCaptionInput } from "./PostDetailCaptionInput";
import { PostDetailDateInput } from "./PostDetailDateInput";
import { PostDetailDeleteButton } from "./PostDetailDeleteButton";
import { PostDetailHead } from "./PostDetailHead";
import { PostDetailMedia } from "./PostDetailMedia";
import { PostDetailStatusButton } from "./PostDetailStatusButton";

type PostDetailProps = {
  post: Post | VirtualPost;
  onUpdate: () => Promise<void>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const PostDetail = ({ post, onUpdate, isOpen, onOpenChange }: PostDetailProps) => {
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
      // Only close when we've left the outermost element
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
      // if the post is virtual, create a new post
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

  if (isVirtualPost(post)) {
    return (
      <div
        className={cn(
          "border opacity-70 rounded-md relative group transition-colors",
          isDraggedOver && "border-2 border-dashed border-purple-500 bg-purple-50/50 opacity-100"
        )}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <PostDetailHead post={post} isOpen={false} />
        {isDraggedOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-50/50">
            <Plus className="w-6 h-6 text-purple-500" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      value={isOpen ? "item-1" : ""}
      onValueChange={(value) => onOpenChange(!!value)}
    >
      <AccordionItem
        value="item-1"
        className={cn("border rounded-md", {
          "bg-muted opacity-50": isVirtualPost(post),
        })}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <AccordionTrigger
          value="item-1"
          onClick={() => onOpenChange(!isOpen)}
          className={cn(
            "hover:no-underline cursor-pointer hover:bg-muted/50 px-4",
            isOpen && "mb-2",
            !isOpen && "hover:bg-muted/50"
          )}
        >
          <PostDetailHead post={post} isOpen={isOpen} />
        </AccordionTrigger>
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
