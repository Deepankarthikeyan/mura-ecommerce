export const WEBSITE_THEMES = ["ayurvedha", "fashion"] as const;

export type WebsiteTheme = (typeof WEBSITE_THEMES)[number];

export const DEFAULT_WEBSITE_THEME: WebsiteTheme = "ayurvedha";

export const WEBSITE_THEME_CACHE_TAG = "website-theme";

export const WEBSITE_THEME_OPTIONS: { value: WebsiteTheme; label: string }[] = [
  { value: "ayurvedha", label: "Ayurvedha" },
  { value: "fashion", label: "Fashion" },
];

export function isWebsiteTheme(value: unknown): value is WebsiteTheme {
  return typeof value === "string" && WEBSITE_THEMES.includes(value as WebsiteTheme);
}

export function parseWebsiteTheme(value: unknown): WebsiteTheme {
  return isWebsiteTheme(value) ? value : DEFAULT_WEBSITE_THEME;
}

export function applyWebsiteThemeToDocument(theme: WebsiteTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-website-theme", theme);
}
