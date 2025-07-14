import { FanslyAutomationDialog } from "@renderer/components/Automation/FanslyAutomationDialog";
import { Button } from "@renderer/components/ui/Button";
import { Input } from "@renderer/components/ui/Input";
import { Textarea } from "@renderer/components/ui/Textarea";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { AlertTriangle, Bot, Eye, EyeOff, InfoIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SettingRow } from "./SettingRow";

type FanslyCredentials = {
  fanslyAuth?: string;
  fanslySessionId?: string;
  fanslyClientCheck?: string;
  fanslyClientId?: string;
};

const parseFetchRequest = (fetchRequest: string): Partial<FanslyCredentials> => {
  const credentials: Partial<FanslyCredentials> = {};

  try {
    // Extract authorization header
    const authMatch = fetchRequest.match(/"authorization":\s*"([^"]+)"/);
    if (authMatch) {
      credentials.fanslyAuth = authMatch[1];
    }

    // Extract fansly-session-id header
    const sessionMatch = fetchRequest.match(/"fansly-session-id":\s*"([^"]+)"/);
    if (sessionMatch) {
      credentials.fanslySessionId = sessionMatch[1];
    }

    // Extract fansly-client-check header
    const clientCheckMatch = fetchRequest.match(/"fansly-client-check":\s*"([^"]+)"/);
    if (clientCheckMatch) {
      credentials.fanslyClientCheck = clientCheckMatch[1];
    }

    // Extract fansly-client-id header
    const clientIdMatch = fetchRequest.match(/"fansly-client-id":\s*"([^"]+)"/);
    if (clientIdMatch) {
      credentials.fanslyClientId = clientIdMatch[1];
    }
  } catch (error) {
    console.error("Error parsing fetch request:", error);
  }

  return credentials;
};

export const FanslySettings = () => {
  const [credentials, setCredentials] = useState<FanslyCredentials>({});
  const [showTokens, setShowTokens] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchRequest, setFetchRequest] = useState("");
  const [showAutomationDialog, setShowAutomationDialog] = useState(false);
  const { toast } = useToast();

  const loadCredentials = useCallback(async () => {
    try {
      const loadedCredentials = await window.api["settings:loadFanslyCredentials"]();
      setCredentials(loadedCredentials);
    } catch (error) {
      console.error("Failed to load Fansly credentials:", error);
    }
  }, []);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  const saveCredentials = useCallback(async () => {
    setIsLoading(true);
    try {
      await window.api["settings:saveFanslyCredentials"](credentials);
      toast({
        title: "Fansly credentials saved",
        description: "Your credentials have been securely encrypted and stored.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to save credentials",
        description: "There was an error saving your Fansly credentials.",
        variant: "destructive",
      });
      console.error("Failed to save Fansly credentials:", error);
    } finally {
      setIsLoading(false);
    }
  }, [credentials, toast]);

  const clearCredentials = useCallback(async () => {
    setIsLoading(true);
    try {
      await window.api["settings:clearFanslyCredentials"]();
      setCredentials({});
      setFetchRequest("");
      toast({
        title: "Fansly credentials cleared",
        description: "All stored credentials have been removed.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to clear credentials",
        variant: "destructive",
      });
      console.error("Failed to clear Fansly credentials:", error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateCredential = (key: keyof FanslyCredentials, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleAutomationCredentials = (automationCredentials: any) => {
    // Convert automation credentials to our format
    const converted: FanslyCredentials = {
      fanslyAuth: automationCredentials.authorization,
      fanslySessionId: automationCredentials.fanslySessionId,
      fanslyClientCheck: automationCredentials.fanslyClientCheck,
      fanslyClientId: automationCredentials.fanslyClientId,
    };

    setCredentials(converted);
    setShowAutomationDialog(false);
    setImmediate(() => {
      saveCredentials();
    });
  };

  const parseFetchRequestAndUpdateCredentials = () => {
    const parsed = parseFetchRequest(fetchRequest);

    if (Object.keys(parsed).length === 0) {
      toast({
        title: "Could not parse fetch request",
        description: "Please make sure you copied the entire fetch request from Chrome DevTools.",
        variant: "destructive",
      });
      return;
    }

    const missingHeaders = [];
    if (!parsed.fanslyAuth) missingHeaders.push("authorization");
    if (!parsed.fanslySessionId) missingHeaders.push("fansly-session-id");
    if (!parsed.fanslyClientCheck) missingHeaders.push("fansly-client-check");
    if (!parsed.fanslyClientId) missingHeaders.push("fansly-client-id");

    if (missingHeaders.length > 0) {
      toast({
        title: "Missing required headers",
        description: `Could not find: ${missingHeaders.join(", ")}`,
        variant: "destructive",
      });
    }

    setCredentials(parsed);

    if (missingHeaders.length === 0) {
      toast({
        title: "Headers parsed successfully",
        description: "All required credentials have been extracted.",
      });
    }
  };

  const inputType = showTokens ? "text" : "password";
  const hasAllCredentials =
    credentials.fanslyAuth &&
    credentials.fanslySessionId &&
    credentials.fanslyClientCheck &&
    credentials.fanslyClientId;
  const hasAnyCredentials =
    credentials.fanslyAuth ||
    credentials.fanslySessionId ||
    credentials.fanslyClientCheck ||
    credentials.fanslyClientId;

  return (
    <div className="space-y-4">
      {hasAnyCredentials && (
        <>
          {!hasAllCredentials && (
            <div className="relative w-full rounded-lg border p-4 border-destructive/50 text-destructive">
              <div className="flex">
                <AlertTriangle className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  All four credentials are required for Fansly analytics to work properly.
                </div>
              </div>
            </div>
          )}

          <SettingRow title="Credentials" description="Fansly API credentials for analytics">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTokens(!showTokens)}
              className="w-auto"
            >
              {showTokens ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showTokens ? "Hide" : "Show"} Tokens
            </Button>
          </SettingRow>

          <SettingRow title="Authorization Header" variant="secondary" spacing="compact">
            <Input
              type={inputType}
              id="fansly-auth"
              placeholder="Enter the authorization header value"
              value={credentials.fanslyAuth ?? ""}
              onChange={(e) => updateCredential("fanslyAuth", e.target.value)}
              className="max-w-md"
            />
          </SettingRow>

          <SettingRow title="Session ID" variant="secondary" spacing="compact">
            <Input
              type={inputType}
              id="fansly-session-id"
              placeholder="Enter the fansly-session-id header value"
              value={credentials.fanslySessionId ?? ""}
              onChange={(e) => updateCredential("fanslySessionId", e.target.value)}
              className="max-w-md"
            />
          </SettingRow>

          <SettingRow title="Client Check" variant="secondary" spacing="compact">
            <Input
              type={inputType}
              id="fansly-client-check"
              placeholder="Enter the fansly-client-check header value"
              value={credentials.fanslyClientCheck ?? ""}
              onChange={(e) => updateCredential("fanslyClientCheck", e.target.value)}
              className="max-w-md"
            />
          </SettingRow>

          <SettingRow title="Client ID" variant="secondary" spacing="compact">
            <Input
              type={inputType}
              id="fansly-client-id"
              placeholder="Enter the fansly-client-id header value"
              value={credentials.fanslyClientId ?? ""}
              onChange={(e) => updateCredential("fanslyClientId", e.target.value)}
              className="max-w-md"
            />
          </SettingRow>

          <SettingRow>
            <div className="flex gap-2">
              <Button onClick={saveCredentials} disabled={isLoading || !hasAllCredentials}>
                Save Credentials
              </Button>
              <Button variant="outline" onClick={clearCredentials} disabled={isLoading}>
                Clear All
              </Button>
            </div>
          </SettingRow>
        </>
      )}

      {/* Automation Section */}
      <SettingRow
        title="Automated credential extraction"
        descriptionSlot={
          <div className="relative w-full rounded-lg p-4 bg-background text-foreground">
            <div className="flex">
              <Bot className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-blue-500" />
              <div className="text-sm">
                <strong>New:</strong> Automatically extract credentials using browser automation.
                <br />
                This eliminates the need to manually copy fetch requests from Chrome DevTools.
              </div>
            </div>
          </div>
        }
      >
        <div className="pt-4">
          <Button onClick={() => setShowAutomationDialog(true)} className="w-fit" variant="default">
            <Bot className="h-4 w-4 mr-2" />
            Extract Credentials Automatically
          </Button>
        </div>
      </SettingRow>

      <SettingRow
        title="Manual credential extraction"
        descriptionSlot={
          <div className="relative w-full rounded-lg p-4 bg-background text-foreground">
            <div className="flex">
              <InfoIcon className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <strong>Fallback method:</strong> If automation fails, copy a fetch request from
                Chrome DevTools.
                <br />
                Go to Fansly → Developer Tools → Network tab → find any API request → right-click →
                Copy as fetch and paste it below.
              </div>
            </div>
          </div>
        }
      >
        <div className="space-y-4 pt-8 w-full">
          <Textarea
            id="fetch-request"
            placeholder="Paste the entire fetch request copied from Chrome DevTools Network tab here..."
            value={fetchRequest}
            onChange={(e) => setFetchRequest(e.target.value)}
            className="min-h-[120px] font-mono text-xs"
          />
          <Button
            onClick={parseFetchRequestAndUpdateCredentials}
            disabled={!fetchRequest.trim()}
            className="w-fit"
          >
            Parse
          </Button>
        </div>
      </SettingRow>

      {/* Automation Dialog */}
      <FanslyAutomationDialog
        isOpen={showAutomationDialog}
        onClose={() => setShowAutomationDialog(false)}
        onCredentialsExtracted={handleAutomationCredentials}
        mode="credentials"
      />
    </div>
  );
};
