import { useState } from "react";
import { Button } from "@renderer/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@renderer/components/ui/card";
import { Alert, AlertDescription } from "@renderer/components/ui/alert";
import { Badge } from "@renderer/components/ui/badge";
import { useSettings } from "@renderer/contexts/SettingsContext";
import { PathMigrationResult, ValidationResult } from "../../../../features/library/api-type";

export const PathMigration = () => {
  const { settings } = useSettings();
  const [isValidating, setIsValidating] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [migrationResult, setMigrationResult] = useState<PathMigrationResult | null>(null);

  const handleValidate = async () => {
    if (!settings?.libraryPath) {
      return;
    }

    setIsValidating(true);
    try {
      const results = await window.api["library:validateMigration"](settings.libraryPath);
      setValidationResults(results);
    } catch (error) {
      console.error("Validation failed:", error);
      setValidationResults([{
        type: "error",
        message: `Validation failed: ${error instanceof Error ? error.message : String(error)}`,
      }]);
    } finally {
      setIsValidating(false);
    }
  };

  const handleMigrate = async () => {
    if (!settings?.libraryPath) {
      return;
    }

    setIsMigrating(true);
    try {
      const result = await window.api["library:migrateToRelativePaths"](settings.libraryPath);
      setMigrationResult(result);
      // Re-validate after migration
      await handleValidate();
    } catch (error) {
      console.error("Migration failed:", error);
      setMigrationResult({
        success: false,
        migratedCount: 0,
        errors: [{
          type: "error",
          message: `Migration failed: ${error instanceof Error ? error.message : String(error)}`,
        }],
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const errorCount = validationResults.filter(r => r.type === "error").length;
  const warningCount = validationResults.filter(r => r.type === "warning").length;
  const hasIssues = errorCount > 0 || warningCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Path Migration</CardTitle>
        <CardDescription>
          Convert your library from absolute paths to relative paths for better portability.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!settings?.libraryPath && (
          <Alert>
            <AlertDescription>
              Library path must be set before migration can be performed.
            </AlertDescription>
          </Alert>
        )}

        {settings?.libraryPath && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={handleValidate}
                disabled={isValidating || isMigrating}
                variant="outline"
              >
                {isValidating ? "Validating..." : "Validate Migration"}
              </Button>
              <Button
                onClick={handleMigrate}
                disabled={isMigrating || isValidating || !settings?.libraryPath}
              >
                {isMigrating ? "Migrating..." : "Migrate to Relative Paths"}
              </Button>
            </div>

            {validationResults.length > 0 && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  {errorCount > 0 && (
                    <Badge variant="destructive">{errorCount} errors</Badge>
                  )}
                  {warningCount > 0 && (
                    <Badge variant="secondary">{warningCount} warnings</Badge>
                  )}
                  {!hasIssues && (
                    <Badge variant="default">No issues found</Badge>
                  )}
                </div>

                {hasIssues && (
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {validationResults.map((result, index) => (
                      <Alert key={index} variant={result.type === "error" ? "destructive" : "default"}>
                        <AlertDescription className="text-sm">
                          {result.message}
                          {result.path && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Path: {result.path}
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
            )}

            {migrationResult && (
              <Alert variant={migrationResult.success ? "default" : "destructive"}>
                <AlertDescription>
                  {migrationResult.success ? (
                    <div>
                      <div>Migration completed successfully!</div>
                      <div className="text-sm text-muted-foreground">
                        {migrationResult.migratedCount} media files migrated
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>Migration failed</div>
                      <div className="text-sm text-muted-foreground">
                        {migrationResult.migratedCount} media files migrated before failure
                      </div>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};