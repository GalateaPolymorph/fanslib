import type { Page, Request } from "playwright";
import type { FanslyCredentials } from "./context";

export const extractCredentialsFromRequest = (request: Request): Partial<FanslyCredentials> => {
  const headers = request.headers();
  const credentials: Partial<FanslyCredentials> = {};

  // Extract required Fansly headers
  if (headers.authorization) {
    credentials.authorization = headers.authorization;
  }

  if (headers["fansly-session-id"]) {
    credentials.fanslySessionId = headers["fansly-session-id"];
  }

  if (headers["fansly-client-check"]) {
    credentials.fanslyClientCheck = headers["fansly-client-check"];
  }

  if (headers["fansly-client-id"]) {
    credentials.fanslyClientId = headers["fansly-client-id"];
  }

  return credentials;
};

export const isValidCredentials = (
  credentials: Partial<FanslyCredentials>
): credentials is FanslyCredentials => {
  return !!(
    credentials.authorization &&
    credentials.fanslySessionId &&
    credentials.fanslyClientCheck &&
    credentials.fanslyClientId
  );
};

export const setupCredentialExtraction = async (page: Page): Promise<FanslyCredentials> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timeout waiting for credentials"));
    }, 60000); // 1 minute timeout

    const extractedCredentials: Partial<FanslyCredentials> = {};

    // Listen for requests to Fansly API endpoints
    page.on("request", (request) => {
      const url = request.url();

      // Check if this is a request to Fansly API
      if (url.includes("apiv3.fansly.com") || url.includes("fansly.com/api")) {
        const credentials = extractCredentialsFromRequest(request);

        // Merge new credentials with existing ones
        Object.assign(extractedCredentials, credentials);

        // Check if we have all required credentials
        if (isValidCredentials(extractedCredentials)) {
          clearTimeout(timeout);
          resolve(extractedCredentials);
        }
      }
    });

    // Also listen for responses in case credentials are in response headers
    page.on("response", (response) => {
      const url = response.url();

      if (url.includes("apiv3.fansly.com") || url.includes("fansly.com/api")) {
        const headers = response.headers();
        const credentials: Partial<FanslyCredentials> = {};

        // Some credentials might be set in response headers
        if (headers["set-authorization"]) {
          credentials.authorization = headers["set-authorization"];
        }

        if (headers["set-fansly-session-id"]) {
          credentials.fanslySessionId = headers["set-fansly-session-id"];
        }

        Object.assign(extractedCredentials, credentials);

        if (isValidCredentials(extractedCredentials)) {
          clearTimeout(timeout);
          resolve(extractedCredentials);
        }
      }
    });
  });
};

export const validateCredentials = async (credentials: FanslyCredentials): Promise<boolean> => {
  try {
    // Make a test request to validate credentials
    const response = await fetch("https://apiv3.fansly.com/api/v1/account/me", {
      headers: {
        authorization: credentials.authorization,
        "fansly-session-id": credentials.fanslySessionId,
        "fansly-client-check": credentials.fanslyClientCheck,
        "fansly-client-id": credentials.fanslyClientId,
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("[Fansly Automation] Error validating credentials:", error);
    return false;
  }
};
