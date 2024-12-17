import { Button } from "@renderer/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { useToast } from "@renderer/components/ui/use-toast";
import { CalendarDays, Check, Info, Undo2 } from "lucide-react";
import { Post } from "../../../../../features/posts/entity";
import { StatusBadge } from "../../../components/StatusBadge";

type PostDetailStatusButtonProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

const InfoTooltip = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground hover:text-foreground"
      >
        <Info className="size-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="top" align="center" className="max-w-[300px]">
      <p>
        FansLib helps you organize your posts but cannot automatically post them. You'll need to
        manually post/schedule content on each platform as they don't support external posting.
        After doing so, you can mark your post as scheduled or posted here.
      </p>
    </TooltipContent>
  </Tooltip>
);

export const PostDetailStatusButton = ({ post, onUpdate }: PostDetailStatusButtonProps) => {
  const { toast } = useToast();

  const handleUpdateStatus = async (status: "draft" | "scheduled" | "posted") => {
    try {
      await window.api["post:update"](post.id, { status });
      await onUpdate();
      toast({
        title: `Post ${status === "draft" ? "moved back to draft" : status}`,
      });
    } catch (err) {
      toast({
        title: `Failed to ${status === "draft" ? "move back to draft" : status} post`,
        variant: "destructive",
      });
      console.error(`Failed to update post status to ${status}:`, err);
    }
  };

  const renderButtons = () => {
    if (post.status === "draft") {
      return (
        <>
          <StatusBadge status={post.status} className="mr-2" />
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus("scheduled")}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-100"
          >
            <CalendarDays className="size-4 mr-2" />
            Mark scheduled
          </Button>
          <Button
            onClick={() => handleUpdateStatus("posted")}
            className="bg-green-500 hover:bg-green-600"
          >
            <Check className="size-4 mr-2" />
            Mark posted
          </Button>
          <InfoTooltip />
        </>
      );
    }

    if (post.status === "scheduled") {
      return (
        <>
          <StatusBadge status={post.status} className="mr-2" />
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus("draft")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Undo2 className="size-4 mr-2" />
            Back to Draft
          </Button>
          <Button
            onClick={() => handleUpdateStatus("posted")}
            className="bg-green-500 hover:bg-green-600"
          >
            <Check className="size-4 mr-2" />
            Mark posted
          </Button>
          <InfoTooltip />
        </>
      );
    }

    if (post.status === "posted") {
      return (
        <>
          <StatusBadge status={post.status} className="mr-2" />
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus("draft")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Undo2 className="size-4 mr-2" />
            Back to Draft
          </Button>
          <InfoTooltip />
        </>
      );
    }

    return null;
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">{renderButtons()}</div>
    </TooltipProvider>
  );
};