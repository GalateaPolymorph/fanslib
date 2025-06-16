export type Settings = {
  readonly theme: "light" | "dark";
  readonly libraryPath: string;
  readonly blueskyUsername?: string;
  readonly postponeToken?: string;
  readonly blueskyDefaultExpiryDays?: number;
};

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  theme: "dark",
  libraryPath: "",
  blueskyUsername: "",
  postponeToken: "",
  blueskyDefaultExpiryDays: 7,
} as const;
