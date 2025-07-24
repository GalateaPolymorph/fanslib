import { Button } from "@renderer/components/ui/Button";
import { useAdjacentPosts } from "@renderer/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Post } from "src/features/posts/entity";

type PostDetailNavigationProps = {
  post: Post;
};

export const PostDetailNavigation = ({ post }: PostDetailNavigationProps) => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const { data: adjacentPosts, isLoading } = useAdjacentPosts(postId);

  const navigateToPrevious = useCallback(() => {
    if (adjacentPosts?.previous) {
      navigate(`/posts/${adjacentPosts.previous.id}`);
    }
  }, [adjacentPosts?.previous, navigate]);

  const navigateToNext = useCallback(() => {
    if (adjacentPosts?.next) {
      navigate(`/posts/${adjacentPosts.next.id}`);
    }
  }, [adjacentPosts?.next, navigate]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard events if no input is focused
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("contenteditable") === "true";

      if (isInputFocused) return;

      // Arrow keys with optional modifiers
      if ((event.key === "ArrowLeft" || event.key === "h") && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        navigateToPrevious();
      } else if (
        (event.key === "ArrowRight" || event.key === "l") &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
        navigateToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigateToPrevious, navigateToNext]);

  if (isLoading) {
    return null;
  }

  const hasPrevious = !!adjacentPosts?.previous;
  const hasNext = !!adjacentPosts?.next;

  if (!hasPrevious && !hasNext) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={navigateToPrevious}
        disabled={!hasPrevious}
        title={hasPrevious ? `Previous post in ${post.channel.name} (Ctrl+←)` : undefined}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={navigateToNext}
        disabled={!hasNext}
        title={hasNext ? `Next post in ${post.channel.name} (Ctrl+→)` : undefined}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
