import { Button } from "@renderer/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/Tooltip";
import { useUpdatePost } from "@renderer/hooks";
import { CalendarDays, Check, Info, Undo2 } from "lucide-react";
import { Post } from "src/features/posts/entity";
import { StatusBadge } from "../../components/StatusBadge";

type PostDetailStatusButtonProps = {
  post: Post;
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
        FansLib helps you organize your posts but cannot automatically post them. You&apos;ll need
        to manually post/schedule content on each platform as they don&apos;t support external
        posting. After doing so, you can mark your post as scheduled or posted here.
      </p>
    </TooltipContent>
  </Tooltip>
);

export const PostDetailStatusButton = ({ post }: PostDetailStatusButtonProps) => {
  const updatePostMutation = useUpdatePost();

  const handleUpdateStatus = async (status: "draft" | "scheduled" | "posted") => {
    try {
      await updatePostMutation.mutateAsync({
        postId: post.id,
        updates: { status },
      });
    } catch (err) {
      // Error handling is done in the mutation
      console.error(`Failed to update post status to ${status}:`, err);
    }
  };

  const renderButtons = () => {
    const isUpdating = updatePostMutation.isPending;

    if (post.status === "draft") {
      return (
        <>
          <StatusBadge status={post.status} className="justify-self-start" />
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus("scheduled")}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-100"
            disabled={isUpdating}
          >
            <CalendarDays className="size-4 mr-2" />
            Mark scheduled
          </Button>
          <Button
            onClick={() => handleUpdateStatus("posted")}
            className="bg-green-500 hover:bg-green-600"
            disabled={isUpdating}
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
          <StatusBadge status={post.status} className="justify-self-start" />
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus("draft")}
            className="text-muted-foreground hover:text-foreground"
            disabled={isUpdating}
          >
            <Undo2 className="size-4 mr-2" />
            Back to Draft
          </Button>
          <Button
            onClick={() => handleUpdateStatus("posted")}
            className="bg-green-500 hover:bg-green-600"
            disabled={isUpdating}
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
          <StatusBadge status={post.status} className="justify-self-start" />
          <Button
            variant="outline"
            onClick={() => handleUpdateStatus("draft")}
            className="text-muted-foreground hover:text-foreground"
            disabled={isUpdating}
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
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
        {renderButtons()}
      </div>
    </TooltipProvider>
  );
};
