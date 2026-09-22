import { THEME_COLOR_DEFAULTS } from "@/themes/registry";
import { DEFAULT_WEBSITE_THEME, type WebsiteTheme } from "./websiteTheme";

export const WEBSITE_COLOR_KEYS = [
  "primary",
  "primaryDark",
  "primaryLight",
  "secondary",
  "heading",
  "body",
  "onPrimary",
  "background",
  "success",
  "danger",
  "warning",
  "info",
] as const;

export type WebsiteColorKey = (typeof WEBSITE_COLOR_KEYS)[number];
export type WebsiteColors = Record<WebsiteColorKey, string>;

export type WebsiteColorGroup = "Brand" | "Text" | "Surfaces" | "Status";

export const WEBSITE_COLOR_META: Record<
  WebsiteColorKey,
  { label: string; hint: string; group: WebsiteColorGroup }
> = {
  primary: {
    label: "Primary",
    hint: "Buttons, links, badges, and brand highlights",
    group: "Brand",
  },
  primaryDark: {
    label: "Primary dark",
    hint: "Hover states and darker brand accents",
    group: "Brand",
  },
  primaryLight: {
    label: "Primary light",
    hint: "Tinted backgrounds and selected rows",
    group: "Brand",
  },
  secondary: {
    label: "Secondary",
    hint: "Secondary surfaces and contrast blocks",
    group: "Brand",
  },
  heading: {
    label: "Heading",
    hint: "Page titles and section headings",
    group: "Text",
  },
  body: {
    label: "Body text",
    hint: "Paragraphs and supporting copy",
    group: "Text",
  },
  onPrimary: {
    label: "Text on primary",
    hint: "Text and icons on primary buttons",
    group: "Text",
  },
  background: {
    label: "Page background",
    hint: "Default page and card background",
    group: "Surfaces",
  },
  success: {
    label: "Success",
    hint: "Positive states and confirmations",
    group: "Status",
  },
  danger: {
    label: "Danger",
    hint: "Errors, cancellations, and destructive actions",
    group: "Status",
  },
  warning: {
    label: "Warning",
    hint: "Caution and attention states",
    group: "Status",
  },
  info: {
    label: "Info",
    hint: "Informational highlights",
    group: "Status",
  },
};

export const WEBSITE_COLOR_GROUPS: WebsiteColorGroup[] = [
  "Brand",
  "Text",
  "Surfaces",
  "Status",
];

/** Defaults match the Ayurvedha storefront tokens. */
export const DEFAULT_WEBSITE_COLORS: WebsiteColors = { ...THEME_COLOR_DEFAULTS.ayurvedha };

export function getThemeColorDefaults(theme: WebsiteTheme = DEFAULT_WEBSITE_THEME): WebsiteColors {
  return { ...THEME_COLOR_DEFAULTS[theme] };
}

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && HEX_COLOR_RE.test(value.trim());
}

function expandShortHex(hex: string): string {
  const raw = hex.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    const r = raw[1];
    const g = raw[2];
    const b = raw[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return raw.toUpperCase();
}

export function normalizeHexColor(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (!isHexColor(trimmed)) return expandShortHex(fallback);
  return expandShortHex(trimmed);
}

export function mergeWebsiteColors(
  input?: Partial<Record<string, unknown>> | null,
  theme: WebsiteTheme = DEFAULT_WEBSITE_THEME,
): WebsiteColors {
  const next = getThemeColorDefaults(theme);
  if (!input || typeof input !== "object") return next;
  for (const key of WEBSITE_COLOR_KEYS) {
    const value = input[key];
    if (isHexColor(value)) {
      next[key] = normalizeHexColor(value, next[key]);
    }
  }
  return next;
}

export function websiteColorsToCss(
  colors: WebsiteColors,
  theme: WebsiteTheme = DEFAULT_WEBSITE_THEME,
): string {
  const c = mergeWebsiteColors(colors, theme);
  return `[data-website-theme="${theme}"] {
  --color-primary: ${c.primary} !important;
  --color-primary-2: ${c.primary} !important;
  --color-primary-3: ${c.primaryLight} !important;
  --color-primary-dark: ${c.primaryDark} !important;
  --color-primary-light: ${c.primaryLight} !important;
  --color-secondary: ${c.secondary} !important;
  --color-heading-1: ${c.heading} !important;
  --color-body: ${c.body} !important;
  --color-on-primary: ${c.onPrimary} !important;
  --color-success: ${c.success} !important;
  --color-danger: ${c.danger} !important;
  --color-warning: ${c.warning} !important;
  --color-info: ${c.info} !important;
  --color-background: ${c.background} !important;
  --background: ${c.background} !important;
  --foreground: ${c.heading} !important;
}
.theme-bg-primary,
.bg-theme-primary {
  background-color: var(--color-primary) !important;
}
.theme-text-primary {
  color: var(--color-primary) !important;
}
.theme-link-hover:hover {
  color: var(--color-primary) !important;
}
.rts-btn.btn-primary {
  background: var(--color-primary) !important;
  background-color: var(--color-primary) !important;
  border-color: var(--color-primary) !important;
  color: var(--color-on-primary, #fff) !important;
}
.rts-btn.btn-primary:hover,
.rts-btn.btn-primary:focus {
  background: var(--color-primary-dark, var(--color-primary)) !important;
  background-color: var(--color-primary-dark, var(--color-primary)) !important;
  border-color: var(--color-primary-dark, var(--color-primary)) !important;
}
[fill="#629D23"],
[fill="#629d23"] {
  fill: var(--color-primary) !important;
}
[stroke="#629D23"],
[stroke="#629d23"] {
  stroke: var(--color-primary) !important;
}
[fill="#1f72b0"],
[fill="#1F72B0"] {
  fill: var(--color-primary) !important;
}
[stroke="#1f72b0"],
[stroke="#1F72B0"] {
  stroke: var(--color-primary) !important;
}
`;
}

export function applyWebsiteColorsToDocument(
  colors: WebsiteColors,
  theme: WebsiteTheme = DEFAULT_WEBSITE_THEME,
): void {
  if (typeof document === "undefined") return;
  const css = websiteColorsToCss(colors, theme);
  let el = document.getElementById("website-theme");
  if (!el) {
    el = document.createElement("style");
    el.id = "website-theme";
    document.head.appendChild(el);
  }
  el.textContent = css;
}

export const WEBSITE_COLORS_CACHE_TAG = "website-colors";
