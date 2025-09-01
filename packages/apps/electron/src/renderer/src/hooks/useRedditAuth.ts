import { useCallback, useState } from "react";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { LoginStatus } from "../utils/authStatusUtils";
import { withErrorHandling } from "../utils/errorHandling";

export const useRedditAuth = (
  updateCache: (sessionStatus: any, loginStatus: LoginStatus | null) => void,
  loadSessionStatus: (username?: string) => Promise<any>
) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);
  const { toast } = useToast();

  const refreshStatus = useCallback(async () => {
    const result = await withErrorHandling(
      async () => {
        setIsCheckingLogin(true);
        const loginResult = await window.api["reddit-poster:checkLoginStatus"]();
        const sessionStatus = await window.api["server-communication:getSessionStatus"](
          loginResult.username
        );
        updateCache(sessionStatus, loginResult);

        toast({
          title: "Status Refreshed",
          description: "Reddit authentication status has been updated",
        });

        return { loginResult, sessionStatus };
      },
      "Failed to refresh status",
      (error) => {
        toast({
          variant: "destructive",
          title: "Refresh Failed",
          description: error.message,
        });
      }
    );

    setIsCheckingLogin(false);
    return result;
  }, [toast, updateCache]);

  const performLogin = useCallback(async () => {
    const result = await withErrorHandling(
      async () => {
        setIsLoggingIn(true);

        // First check if user is already logged in
        const currentLoginStatus = await window.api["reddit-poster:checkLoginStatus"]();

        if (currentLoginStatus.isLoggedIn && currentLoginStatus.username) {
          toast({
            title: "Already Logged In",
            description: `You are already logged in as u/${currentLoginStatus.username}`,
          });

          // Check if session exists on server, if not, sync it
          try {
            const serverSessionStatus = await loadSessionStatus(currentLoginStatus.username);

            if (!serverSessionStatus?.hasSession) {
              // Session not on server, need to sync from local session
              const syncResult = await window.api["server-communication:syncSession"](
                currentLoginStatus.username
              );

              if (syncResult) {
                toast({
                  title: "Session Synced",
                  description: `Local session synced to server for u/${currentLoginStatus.username}`,
                });
              } else {
                console.warn("Failed to sync local session to server");
              }
            }

            // Update UI with latest status
            const finalSessionStatus = await loadSessionStatus(currentLoginStatus.username);
            updateCache(finalSessionStatus, currentLoginStatus);
          } catch (syncError) {
            console.warn("Session sync process failed:", syncError);
            // Still update UI with current login status
            const basicSessionStatus = await loadSessionStatus(currentLoginStatus.username);
            updateCache(basicSessionStatus, currentLoginStatus);
          }

          return true;
        }

        // If not logged in, perform fresh login
        const loginResult = await window.api["reddit-poster:loginToReddit"]();

        if (!loginResult) {
          throw new Error("Failed to complete Reddit login. Please try again.");
        }

        toast({
          title: "Login Successful",
          description: "Successfully logged in to Reddit and session saved",
        });

        // Add delay to allow user to see browser messages
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update UI with new login status
        try {
          const loginStatusResult = await window.api["reddit-poster:checkLoginStatus"]();

          if (loginStatusResult.isLoggedIn && loginStatusResult.username) {
            // With server-only approach, sessions are stored directly during login
            // Just need to update the UI
            const newSessionStatus = await loadSessionStatus(loginStatusResult.username);
            updateCache(newSessionStatus, loginStatusResult);

            toast({
              title: "Session Ready",
              description: `Login completed for u/${loginStatusResult.username}`,
            });
          } else {
            throw new Error("Unable to verify login status after login");
          }
        } catch (statusError) {
          console.warn("Failed to update status after login:", statusError);
          toast({
            variant: "default",
            title: "Status Update Issue",
            description:
              "Login successful, but there was an issue updating the status. Try refreshing.",
          });

          // Still try to update with basic status
          try {
            const loginStatusResult = await window.api["reddit-poster:checkLoginStatus"]();
            const newSessionStatus = await loadSessionStatus();
            updateCache(newSessionStatus, loginStatusResult);
          } catch (fallbackError) {
            console.warn("Failed fallback status update:", fallbackError);
          }
        }

        return true;
      },
      "Failed to login to Reddit",
      (error) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message,
        });
      }
    );

    setIsLoggingIn(false);
    return result;
  }, [toast, loadSessionStatus, updateCache]);

  return {
    isLoggingIn,
    isCheckingLogin,
    refreshStatus,
    performLogin,
  };
};
