import { Accordion, AccordionContent, AccordionItem } from "@renderer/components/ui/accordion";
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
  return (
    <Accordion
      type="single"
      value={isOpen ? "item-1" : ""}
      onValueChange={(value) => onOpenChange(!!value)}
    >
      <AccordionItem value="item-1" className="border rounded-md">
        <PostDetailHead post={post} isOpen={isOpen} setIsOpen={onOpenChange} />
        <AccordionContent className="px-4">
          <div className="flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <PostDetailMedia post={post} onUpdate={onUpdate} />
            <PostDetailCaptionInput post={post} onUpdate={onUpdate} />
            <div className="flex justify-between gap-2">
              <PostDetailDeleteButton post={post} onUpdate={onUpdate} />
              <div className="flex gap-2">
                <PostDetailDateInput post={post} onUpdate={onUpdate} />
                <PostDetailStatusButton post={post} onUpdate={onUpdate} />
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
