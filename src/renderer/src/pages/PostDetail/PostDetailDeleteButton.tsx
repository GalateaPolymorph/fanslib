import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@renderer/components/ui/alert-dialog";
import { Button } from "@renderer/components/ui/button";
import { useToast } from "@renderer/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Post } from "src/features/posts/entity";

type PostDetailDeleteButtonProps = {
  post: Post;
  onUpdate: () => Promise<void>;
};

export const PostDetailDeleteButton = ({ post, onUpdate }: PostDetailDeleteButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const deletePost = async () => {
    try {
      await window.api["post:delete"](post.id);
      await onUpdate();
      toast({
        title: "Post deleted successfully",
      });
      navigate("/posts");
    } catch (err) {
      toast({
        title: "Failed to delete post",
        variant: "destructive",
      });
      console.error("Failed to delete post:", err);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
          <Trash2 className="size-4 mr-2" />
          Delete Post
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post and remove it from
            all associated media.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={deletePost}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
