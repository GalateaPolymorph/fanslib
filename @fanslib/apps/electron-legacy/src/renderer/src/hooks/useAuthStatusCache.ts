import { useState } from "react";
import { 
  SessionStatus, 
  LoginStatus, 
  loadCachedStatus, 
  saveCachedStatus,
  isStatusStale 
} from "../utils/authStatusUtils";

export const useAuthStatusCache = () => {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(() => {
    const cached = loadCachedStatus();
    return cached?.sessionStatus || null;
  });
  
  const [loginStatus, setLoginStatus] = useState<LoginStatus | null>(() => {
    const cached = loadCachedStatus();
    return cached?.loginStatus || null;
  });
  
  const [lastChecked, setLastChecked] = useState<string | null>(() => {
    const cached = loadCachedStatus();
    return cached?.lastChecked || null;
  });

  const updateCache = (
    newSessionStatus: SessionStatus | null,
    newLoginStatus: LoginStatus | null
  ) => {
    const now = new Date().toISOString();
    setSessionStatus(newSessionStatus);
    setLoginStatus(newLoginStatus);
    setLastChecked(now);
    saveCachedStatus(newSessionStatus, newLoginStatus);
  };

  const isStale = lastChecked ? isStatusStale(lastChecked) : true;

  return {
    sessionStatus,
    loginStatus,
    lastChecked,
    isStale,
    updateCache,
    setSessionStatus,
    setLoginStatus,
  };
};