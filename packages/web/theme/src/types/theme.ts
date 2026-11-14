/**
 * Color tokens every theme must define. Each one becomes a CSS variable on the body
 * (`background` -> `--background`), which the app's CSS maps to its design tokens.
 */
export interface ThemeColors {
  destructive: string;
  "destructive-shadow": string;
  "destructive-foreground": string;
  success: string;
  "success-shadow": string;
  warn: string;
  "warn-shadow": string;
  info: string;
  "info-shadow": string;
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  "primary-shadow": string;
  secondary: string;
  "secondary-foreground": string;
  "secondary-shadow": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  "accent-shadow": string;
  border: string;
  input: string;
  ring: string;
  sidebar: string;
  "sidebar-foreground": string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-accent": string;
  "sidebar-accent-foreground": string;
  "sidebar-border": string;
  "sidebar-ring": string;
}

export type ThemeScheme = "dark" | "light";

export interface Theme<TName extends string = string> {
  /** Unique id of the theme, also what is persisted for the user's choice. */
  name: TName;
  displayName: string;
  /** Minimum user level needed to use the theme. `0` is available to everyone. */
  level: number;
  scheme: ThemeScheme;
  colors: ThemeColors;
}
