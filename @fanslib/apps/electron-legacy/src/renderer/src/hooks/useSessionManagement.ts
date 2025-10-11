import { useCallback, useState } from "react";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { SessionStatus, LoginStatus } from "../utils/authStatusUtils";
import { withErrorHandling } from "../utils/errorHandling";

export const useSessionManagement = (
  updateCache: (sessionStatus: SessionStatus | null, loginStatus: LoginStatus | null) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const loadSessionStatus = useCallback(
    async (username?: string) => {
      const result = await withErrorHandling(
        async () => {
          setIsLoading(true);
          const status = await window.api["server-communication:getSessionStatus"](username);
          return status;
        },
        "Failed to load session status",
        () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load Reddit session status",
          });
        }
      );
      
      setIsLoading(false);
      return result;
    },
    [toast]
  );

  const clearSession = useCallback(async (username?: string) => {
    const success = await withErrorHandling(
      async () => {
        setIsClearing(true);
        const result = await window.api["server-communication:clearSession"](username);
        
        if (result) {
          toast({
            title: "Session Cleared",
            description: "Reddit session has been removed from the server",
          });
          
          const newSessionStatus = await loadSessionStatus(username);
          updateCache(newSessionStatus, null);
          return true;
        } else {
          throw new Error("Failed to clear Reddit session");
        }
      },
      "Failed to clear session",
      (error) => {
        toast({
          variant: "destructive",
          title: "Clear Failed",
          description: error.message,
        });
      }
    );
    
    setIsClearing(false);
    return success;
  }, [toast, loadSessionStatus, updateCache]);

  return {
    isLoading,
    isClearing,
    loadSessionStatus,
    clearSession,
  };
};