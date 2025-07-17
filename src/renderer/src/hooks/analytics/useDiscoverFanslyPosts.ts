import { useMutation } from "@tanstack/react-query";
import { FanslyPostDiscoveryPayload } from "../../../../features/automation/api-type";
import { FanslyAutomationResult } from "../../../../features/automation/playwright-fansly-automation/context";
import { useToast } from "../../components/ui/Toast/use-toast";

export const useDiscoverFanslyPosts = () => {
  const { toast } = useToast();

  return useMutation<FanslyAutomationResult, Error, FanslyPostDiscoveryPayload>({
    mutationFn: async (payload: FanslyPostDiscoveryPayload) => {
      const result = await window.api["automation:discoverFanslyPosts"](payload);

      if (!result.success) {
        throw new Error(result.error || "Failed to discover posts");
      }

      return result;
    },
    onSuccess: (result) => {
      if (result.posts) {
        toast({
          title: "Post discovery completed",
          description: `Discovered ${result.posts.length} posts with URLs`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Post discovery completed",
          description: "No posts discovered",
          duration: 3000,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Post discovery failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    },
  });
};
