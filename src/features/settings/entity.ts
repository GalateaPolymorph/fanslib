export type Settings = {
  readonly theme: "light" | "dark";
  readonly libraryPath: string;
  readonly defaultHashtags: string[];
};

export const DEFAULT_SETTINGS: Readonly<Settings> = {
  theme: "dark",
  libraryPath: "",
  defaultHashtags: [],
} as const;
