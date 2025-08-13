import { Button } from "@renderer/components/ui/Button";
import { LogIn, RefreshCcw, Trash2 } from "lucide-react";
import { SessionStatus } from "../../utils/authStatusUtils";

type AuthenticationActionsProps = {
  sessionStatus: SessionStatus | null;
  isLoggingIn: boolean;
  isClearing: boolean;
  onLogin: () => void;
  onClearSession: () => void;
};

export const AuthenticationActions = ({
  sessionStatus,
  isLoggingIn,
  isClearing,
  onLogin,
  onClearSession,
}: AuthenticationActionsProps) => (
  <div className="flex flex-wrap gap-2 pt-4">
    <Button onClick={onLogin} disabled={isLoggingIn} size="sm">
      {isLoggingIn ? (
        <>
          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
          Logging in...
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          Login to Reddit
        </>
      )}
    </Button>

    {sessionStatus?.hasSession && (
      <Button variant="destructive" onClick={onClearSession} disabled={isClearing} size="sm">
        {isClearing ? (
          <>
            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
            Clearing...
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Session
          </>
        )}
      </Button>
    )}
  </div>
);
