import { getWebsiteColorSettings } from "@/functions/mongodbOperations";
import { unstable_cache } from "next/cache";
import { DEFAULT_WEBSITE_THEME, type WebsiteTheme } from "./websiteTheme";
import {
  WEBSITE_COLORS_CACHE_TAG,
  getThemeColorDefaults,
  mergeWebsiteColors,
  type WebsiteColors,
} from "./websiteColors";

async function loadWebsiteColorsUncached(
  theme: WebsiteTheme = DEFAULT_WEBSITE_THEME,
): Promise<WebsiteColors> {
  try {
    const saved = await getWebsiteColorSettings(theme);
    return mergeWebsiteColors(saved, theme);
  } catch {
    return getThemeColorDefaults(theme);
  }
}

export const loadWebsiteColors = unstable_cache(
  loadWebsiteColorsUncached,
  ["website-colors-by-theme"],
  { revalidate: 60, tags: [WEBSITE_COLORS_CACHE_TAG] },
);

export { WEBSITE_COLORS_CACHE_TAG };
