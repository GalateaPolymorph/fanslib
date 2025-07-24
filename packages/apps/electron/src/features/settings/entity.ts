export type Settings = {
  readonly theme: "light" | "dark";
  readonly libraryPath: string;
  readonly blueskyUsername?: string;
  readonly postponeToken?: string;
  readonly blueskyDefaultExpiryDays?: number;
  readonly sfwMode: boolean;
  readonly sfwBlurIntensity: number;
  readonly sfwDefaultMode: "off" | "on" | "remember";
  readonly sfwHoverDelay: number;
  readonly backgroundJobsServerUrl?: string;
};

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  theme: "dark",
  libraryPath: "",
  blueskyUsername: "",
  postponeToken: "",
  blueskyDefaultExpiryDays: 7,
  sfwMode: false,
  sfwBlurIntensity: 5,
  sfwDefaultMode: "off",
  sfwHoverDelay: 300,
  backgroundJobsServerUrl: "",
} as const;
