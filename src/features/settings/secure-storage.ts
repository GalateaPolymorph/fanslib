import { safeStorage } from "electron";
import * as fs from "fs/promises";
import * as path from "path";
import { settingsFilePath } from "./path";

type EncryptedFanslyCredentials = {
  fanslyAuth?: Buffer;
  fanslySessionId?: Buffer;
  fanslyClientCheck?: Buffer;
  fanslyClientId?: Buffer;
};

type FanslyCredentials = {
  fanslyAuth?: string;
  fanslySessionId?: string;
  fanslyClientCheck?: string;
  fanslyClientId?: string;
};

const getEncryptedFilePath = (): string => {
  const settingsDir = path.dirname(settingsFilePath());
  return path.join(settingsDir, "fansly-credentials.enc");
};

export const saveFanslyCredentials = async (
  credentials: Partial<FanslyCredentials>
): Promise<void> => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("Encryption is not available on this system");
  }

  try {
    // Load existing encrypted credentials
    const existingCredentials = await loadFanslyCredentials().catch(() => ({}));

    // Merge with new credentials
    const updatedCredentials = { ...existingCredentials, ...credentials };

    // Encrypt the credentials
    const encryptedCredentials: EncryptedFanslyCredentials = {};

    if (updatedCredentials.fanslyAuth) {
      encryptedCredentials.fanslyAuth = safeStorage.encryptString(updatedCredentials.fanslyAuth);
    }
    if (updatedCredentials.fanslySessionId) {
      encryptedCredentials.fanslySessionId = safeStorage.encryptString(
        updatedCredentials.fanslySessionId
      );
    }
    if (updatedCredentials.fanslyClientCheck) {
      encryptedCredentials.fanslyClientCheck = safeStorage.encryptString(
        updatedCredentials.fanslyClientCheck
      );
    }
    if (updatedCredentials.fanslyClientId) {
      encryptedCredentials.fanslyClientId = safeStorage.encryptString(
        updatedCredentials.fanslyClientId
      );
    }

    // Convert Buffers to base64 for JSON storage
    const serializable = Object.fromEntries(
      Object.entries(encryptedCredentials).map(([key, buffer]) => [key, buffer?.toString("base64")])
    );

    // Ensure directory exists
    await fs.mkdir(path.dirname(getEncryptedFilePath()), { recursive: true });

    // Save to file
    await fs.writeFile(getEncryptedFilePath(), JSON.stringify(serializable, null, 2));
  } catch (error) {
    console.error("Error saving Fansly credentials:", error);
    throw error;
  }
};

export const loadFanslyCredentials = async (): Promise<FanslyCredentials> => {
  if (!safeStorage.isEncryptionAvailable()) {
    return {};
  }

  try {
    const data = await fs.readFile(getEncryptedFilePath(), "utf8");
    const parsed = JSON.parse(data);

    const credentials: FanslyCredentials = {};

    if (parsed.fanslyAuth) {
      const buffer = Buffer.from(parsed.fanslyAuth, "base64");
      credentials.fanslyAuth = safeStorage.decryptString(buffer);
    }
    if (parsed.fanslySessionId) {
      const buffer = Buffer.from(parsed.fanslySessionId, "base64");
      credentials.fanslySessionId = safeStorage.decryptString(buffer);
    }
    if (parsed.fanslyClientCheck) {
      const buffer = Buffer.from(parsed.fanslyClientCheck, "base64");
      credentials.fanslyClientCheck = safeStorage.decryptString(buffer);
    }
    if (parsed.fanslyClientId) {
      const buffer = Buffer.from(parsed.fanslyClientId, "base64");
      credentials.fanslyClientId = safeStorage.decryptString(buffer);
    }

    return credentials;
  } catch (error) {
    // File doesn't exist or can't be read - return empty credentials
    return {};
  }
};

export const clearFanslyCredentials = async (): Promise<void> => {
  try {
    await fs.unlink(getEncryptedFilePath());
  } catch (error) {
    // File doesn't exist - that's fine
  }
};
