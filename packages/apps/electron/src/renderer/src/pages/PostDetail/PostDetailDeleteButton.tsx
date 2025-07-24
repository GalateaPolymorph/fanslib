import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Post } from "src/features/posts/entity";

import { Button } from "@renderer/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/Dialog";
import { useDeletePost } from "@renderer/hooks";

type PostDetailDeleteButtonProps = {
  post: Post;
};

export const PostDetailDeleteButton = ({ post }: PostDetailDeleteButtonProps) => {
  const navigate = useNavigate();
  const deletePostMutation = useDeletePost();

  const handleDelete = async () => {
    try {
      await deletePostMutation.mutateAsync(post.id);
      navigate("/posts");
    } catch (err) {
      // Error handling is done in the mutation
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
          <Trash2 className="size-4 mr-2" />
          Delete Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the post and remove it from
            all associated media.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={handleDelete}
            disabled={deletePostMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deletePostMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
