import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion";
import { Plus } from "lucide-react";
import { Post } from "../../../../../features/posts/entity";
import { cn } from "../../../lib/utils";
import { isVirtualPost, VirtualPost } from "../../../lib/virtual-posts";
import { PostDetailCaptionInput } from "./PostDetailCaptionInput";
import { PostDetailDateInput } from "./PostDetailDateInput";
import { PostDetailDeleteButton } from "./PostDetailDeleteButton";
import { PostDetailHead } from "./PostDetailHead";
import { PostDetailMedia } from "./PostDetailMedia";
import { PostDetailStatusButton } from "./PostDetailStatusButton";
import { PostDetailTierSelect } from "./PostDetailTierSelect";
import { usePostDetailDrag } from "./usePostDetailDrag";

type PostDetailProps = {
  post: Post | VirtualPost;
  onUpdate: () => Promise<void>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const PostDetail = ({ post, onUpdate, isOpen, onOpenChange }: PostDetailProps) => {
  const {
    isDragging,
    isDraggedOver,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = usePostDetailDrag({
    post,
    isOpen,
    onOpenChange,
    onUpdate,
  });

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
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium">Post Settings</h4>
              <div className="flex flex-col @[600px]:flex-row gap-4">
                <PostDetailTierSelect post={post} onUpdate={onUpdate} />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
