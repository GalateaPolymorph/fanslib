import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion";
import { cn } from "@renderer/lib/utils";
import { VirtualPost, isVirtualPost } from "@renderer/lib/virtual-posts";
import { PostTimelineDropZone } from "@renderer/pages/Plan/PostTimelineDropZone";
import { Plus } from "lucide-react";
import { Post } from "../../../../features/posts/entity";
import { PostDetailCaptionInput } from "./PostDetailCaptionInput";
import { PostDetailDateInput } from "./PostDetailDateInput";
import { PostDetailDeleteButton } from "./PostDetailDeleteButton";
import { PostDetailHead } from "./PostDetailHead";
import { PostDetailMedia } from "./PostDetailMedia";
import { PostDetailStatusButton } from "./PostDetailStatusButton";
import { usePostDetailDrag } from "./usePostDetailDrag";

type PostDetailProps = {
  post: Post | VirtualPost;
  onUpdate: () => Promise<void>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  previousPostInList?: Post | VirtualPost;
};

export const PostDetail = ({
  post,
  onUpdate,
  isOpen,
  onOpenChange,
  previousPostInList,
}: PostDetailProps) => {
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

  const previousDropZone =
    !isDraggedOver || !previousPostInList ? null : (
      <PostTimelineDropZone previousPostDate={new Date(previousPostInList.date)} />
    );
  const nextDropZone = !isDraggedOver ? null : (
    <PostTimelineDropZone previousPostDate={new Date(post.date)} />
  );

  if (isVirtualPost(post)) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previousDropZone}
        <div
          className={cn(
            "border opacity-70 rounded-md relative group transition-colors",
            isDragging &&
              isDraggedOver &&
              "border-2 border-dashed border-purple-500 bg-purple-50/50 opacity-100"
          )}
        >
          <PostDetailHead post={post} isOpen={false} />
          {isDragging && isDraggedOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-50/50">
              <Plus className="w-6 h-6 text-purple-500" />
            </div>
          )}
        </div>
        {nextDropZone}
      </div>
    );
  }
  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {previousDropZone}
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
          <AccordionContent className="px-4">
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
      {nextDropZone}
    </div>
  );
};
