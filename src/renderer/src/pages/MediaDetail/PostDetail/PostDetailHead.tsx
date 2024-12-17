import { ChannelBadge } from "@renderer/components/ChannelBadge";
import { StatusBadge } from "@renderer/components/StatusBadge";
import { AccordionTrigger } from "@renderer/components/ui/accordion";
import { format } from "date-fns";
import { Post } from "../../../../../features/posts/entity";
import { cn } from "../../../lib/utils";

type PostDetailHeadProps = {
  post: Post;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const PostDetailHead = ({ post, isOpen, setIsOpen }: PostDetailHeadProps) => {
  return (
    <AccordionTrigger
      value="item-1"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "px-4 hover:no-underline cursor-pointer hover:bg-muted/50 py-4",
        isOpen && "mb-2",
        !isOpen && "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ChannelBadge name={post.channel.name} typeId={post.channel.typeId} />
          {!isOpen && <StatusBadge status={post.status} />}
          {!isOpen && (
            <span className="text-sm text-muted-foreground">
              {format(new Date(post.date), "PPP")}
            </span>
          )}
        </div>
        <div className="flex items-center"></div>
      </div>
    </AccordionTrigger>
  );
};
