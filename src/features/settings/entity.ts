export type Settings = {
  readonly theme: "light" | "dark";
  readonly libraryPath: string;
  readonly blueskyUsername?: string;
  readonly postponeToken?: string;
};

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  theme: "dark",
  libraryPath: "",
  blueskyUsername: "",
  postponeToken: "",
} as const;
