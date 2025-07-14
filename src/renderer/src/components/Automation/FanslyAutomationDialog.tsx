import { useState } from "react";
import { Button } from "@renderer/components/ui/Button";
import { Input } from "@renderer/components/ui/Input";
import { Label } from "@renderer/components/ui/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/Dialog";
import { Progress } from "@renderer/components/ui/Progress";
import { useToast } from "@renderer/components/ui/Toast/use-toast";
import { AlertTriangle, Bot, CheckCircle, XCircle } from "lucide-react";
import type {
  FanslyAutomationResult,
  FanslyCredentials,
  FanslyPostData,
} from "../../../../features/automation/playwright-fansly-automation/context";

type FanslyAutomationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsExtracted?: (credentials: FanslyCredentials) => void;
  onPostsDiscovered?: (posts: FanslyPostData[]) => void;
  mode: "credentials" | "posts" | "full";
};

export const FanslyAutomationDialog = ({
  isOpen,
  onClose,
  onCredentialsExtracted,
  onPostsDiscovered,
  mode,
}: FanslyAutomationDialogProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [result, setResult] = useState<FanslyAutomationResult | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const getDialogTitle = () => {
    switch (mode) {
      case "credentials":
        return "Extract Fansly Credentials";
      case "posts":
        return "Discover Fansly Posts";
      case "full":
        return "Full Fansly Automation";
      default:
        return "Fansly Automation";
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case "credentials":
        return "Automatically extract authentication credentials from your Fansly session.";
      case "posts":
        return "Discover posts and statistics URLs from your Fansly profile.";
      case "full":
        return "Extract credentials and discover posts in one automated process.";
      default:
        return "Automate Fansly data collection.";
    }
  };

  const runAutomation = async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentStage("");
    setResult(null);

    try {
      let result: FanslyAutomationResult;

      const payload = {
        email: email || undefined,
        password: password || undefined,
        headless: false, // Keep browser visible for user interaction
        maxPosts: 100,
        daysBack: 30,
      };

      switch (mode) {
        case "credentials":
          result = await window.api["automation:extractFanslyCredentials"](payload);
          break;
        case "posts":
          result = await window.api["automation:discoverFanslyPosts"](payload);
          break;
        case "full":
          result = await window.api["automation:runFanslyFullAutomation"](payload);
          break;
        default:
          throw new Error("Invalid automation mode");
      }

      setResult(result);

      if (result.success) {
        if (result.credentials && onCredentialsExtracted) {
          onCredentialsExtracted(result.credentials);
        }
        if (result.posts && onPostsDiscovered) {
          onPostsDiscovered(result.posts);
        }

        toast({
          title: "Automation completed successfully",
          description: `${result.credentials ? "Credentials extracted. " : ""}${
            result.posts ? `${result.posts.length} posts discovered.` : ""
          }`,
          duration: 3000,
        });
      } else {
        toast({
          title: "Automation failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Automation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      setResult({
        success: false,
        error: errorMessage,
        fallbackToManual: true,
      });

      toast({
        title: "Automation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleClose = () => {
    if (!isRunning) {
      onClose();
    }
  };

  const canRunAutomation = () => {
    return !isRunning;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Credentials section */}
          {(mode === "credentials" || mode === "full") && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <strong>Optional:</strong> Provide your login credentials for automatic login. Leave
                blank to log in manually in the browser window.
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isRunning}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password (optional)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isRunning}
                />
              </div>
            </div>
          )}

          {/* Progress section */}
          {isRunning && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              {currentStage && <div className="text-sm text-muted-foreground">{currentStage}</div>}
            </div>
          )}

          {/* Result section */}
          {result && !isRunning && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={result.success ? "text-green-700" : "text-red-700"}>
                  {result.success ? "Automation completed successfully" : "Automation failed"}
                </span>
              </div>

              {result.success && (
                <div className="text-sm space-y-1">
                  {result.credentials && <div>✓ Authentication credentials extracted</div>}
                  {result.posts && (
                    <div>✓ {result.posts.length} posts with statistics discovered</div>
                  )}
                </div>
              )}

              {!result.success && result.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{result.error}</div>
              )}

              {result.fallbackToManual && (
                <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    Automation failed. You can fall back to the manual process using Chrome DevTools
                    to extract credentials.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          {!isRunning && !result && (
            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                <strong>What this automation does:</strong>
              </div>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {(mode === "credentials" || mode === "full") && (
                  <li>Launches a browser and navigates to Fansly</li>
                )}
                {(mode === "credentials" || mode === "full") && (
                  <li>Automatically extracts authentication credentials from network requests</li>
                )}
                {(mode === "posts" || mode === "full") && (
                  <li>Discovers posts and their statistics URLs from your profile</li>
                )}
                <li>Handles 2FA and CAPTCHA with manual fallback</li>
                <li>Saves browser session for future use</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isRunning}>
            {isRunning ? "Running..." : "Cancel"}
          </Button>
          <Button onClick={runAutomation} disabled={!canRunAutomation()}>
            {isRunning ? "Running Automation..." : "Start Automation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
