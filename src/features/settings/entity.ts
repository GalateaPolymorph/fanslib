export type Settings = {
  readonly theme: "light" | "dark";
  readonly libraryPath: string;
};

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  theme: "dark",
  libraryPath: "",
} as const;
