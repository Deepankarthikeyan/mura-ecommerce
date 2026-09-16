import { applyWebsiteThemeToDocument, type WebsiteTheme } from "./websiteTheme";
import { applyWebsiteColorsToDocument, type WebsiteColors } from "./websiteColors";

export function applyWebsiteAppearance(theme: WebsiteTheme, colors: WebsiteColors) {
  applyWebsiteThemeToDocument(theme);
  applyWebsiteColorsToDocument(colors, theme);
}
