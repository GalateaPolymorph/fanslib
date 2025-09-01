import { SettingRow } from "./SettingRow";
import { useAuthStatusCache } from "../../hooks/useAuthStatusCache";
import { useSessionManagement } from "../../hooks/useSessionManagement";
import { useRedditAuth } from "../../hooks/useRedditAuth";
import { getAuthenticationStatus } from "../../utils/authStatusUtils";
import { AuthenticationStatus } from "../../components/RedditSettings/AuthenticationStatus";
import { AuthenticationActions } from "../../components/RedditSettings/AuthenticationActions";

export const RedditSettings = () => {
  const { sessionStatus, loginStatus, lastChecked, isStale, updateCache } = useAuthStatusCache();
  const { isLoading, isClearing, loadSessionStatus, clearSession } =
    useSessionManagement(updateCache);
  const { isLoggingIn, isCheckingLogin, refreshStatus, performLogin } = useRedditAuth(
    updateCache,
    loadSessionStatus
  );

  const handleClearSession = async () => {
    const username = loginStatus?.username || sessionStatus?.session?.username;
    await clearSession(username);
  };

  const authStatus = getAuthenticationStatus(sessionStatus, loginStatus, isLoading, isStale);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Reddit Integration</h2>
        <p className="text-sm text-muted-foreground">
          Manage Reddit authentication for automated posting via the server
        </p>
      </div>

      <div className="space-y-4">
        <SettingRow
          title="Reddit Authentication"
          description="Current authentication status and session management"
        >
          <div className="space-y-4">
            <AuthenticationStatus
              authStatus={authStatus}
              lastChecked={lastChecked}
              isLoading={isLoading}
              isCheckingLogin={isCheckingLogin}
              onRefresh={refreshStatus}
            />

            <AuthenticationActions
              sessionStatus={sessionStatus}
              isLoggingIn={isLoggingIn}
              isClearing={isClearing}
              onLogin={performLogin}
              onClearSession={handleClearSession}
            />
          </div>
        </SettingRow>
      </div>
    </div>
  );
};
