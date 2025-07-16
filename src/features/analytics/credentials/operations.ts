import { saveFanslyCredentials } from "../../settings/secure-storage";
import { FanslyCredentials } from "./api-type";

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

export const updateFanslyCredentialsFromFetch = async (fetchRequest: string): Promise<void> => {
  const credentials = parseFetchRequest(fetchRequest);

  if (!credentials.fanslyAuth || !credentials.fanslySessionId) {
    throw new Error(
      "Could not extract required credentials from fetch request. Please ensure you copied a valid Fansly API request."
    );
  }

  await saveFanslyCredentials(credentials);
};