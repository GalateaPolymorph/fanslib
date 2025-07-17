import { updateFanslyCredentialsFromFetch } from "./operations";
import { CredentialsHandlers } from "./api-type";

export const credentialsHandlers: CredentialsHandlers = {
  updateFanslyCredentialsFromFetch: async (_: unknown, fetchRequest: string) => {
    return updateFanslyCredentialsFromFetch(fetchRequest);
  },
};