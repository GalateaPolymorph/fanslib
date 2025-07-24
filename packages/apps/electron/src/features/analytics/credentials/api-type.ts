export type FanslyCredentials = {
  fanslyAuth?: string;
  fanslySessionId?: string;
  fanslyClientCheck?: string;
  fanslyClientId?: string;
};

export type CredentialsHandlers = {
  updateFanslyCredentialsFromFetch: (_: unknown, fetchRequest: string) => Promise<void>;
};
