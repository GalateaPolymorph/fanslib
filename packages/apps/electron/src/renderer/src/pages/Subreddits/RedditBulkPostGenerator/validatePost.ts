import { GeneratedPost } from "../../../../../features/reddit-poster/api-type";

export const validatePost = (posts: GeneratedPost[]): string[] => {
  if (posts.length === 0) {
    return ["No posts provided for scheduling"];
  }

  const validatePost = (post: GeneratedPost): string[] => {
    const postErrors: string[] = [];

    if (!post.id) {
      postErrors.push("Post must have a unique ID");
    }
    if (!post.subreddit?.name) {
      postErrors.push(`Post ${post.id}: Must have a valid subreddit`);
    }
    if (!post.caption?.trim()) {
      postErrors.push(`Post ${post.id}: Must have a caption`);
    }
    if (!post.date || isNaN(post.date.getTime())) {
      postErrors.push(`Post ${post.id}: Must have a valid scheduled date`);
    }
    if (post.date && post.date < new Date()) {
      postErrors.push(`Post ${post.id}: Scheduled date cannot be in the past`);
    }

    return postErrors;
  };

  return posts.flatMap(validatePost);
};
