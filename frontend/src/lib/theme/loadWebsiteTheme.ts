import { unstable_cache } from "next/cache";
import { getWebsiteThemeSetting } from "@/functions/mongodbOperations";
import {
  DEFAULT_WEBSITE_THEME,
  WEBSITE_THEME_CACHE_TAG,
  parseWebsiteTheme,
  type WebsiteTheme,
} from "./websiteTheme";

async function loadWebsiteThemeUncached(): Promise<WebsiteTheme> {
  try {
    const saved = await getWebsiteThemeSetting();
    return parseWebsiteTheme(saved);
  } catch {
    return DEFAULT_WEBSITE_THEME;
  }
}

export const loadWebsiteTheme = unstable_cache(
  loadWebsiteThemeUncached,
  ["website-theme"],
  { revalidate: 60, tags: [WEBSITE_THEME_CACHE_TAG] },
);

export { WEBSITE_THEME_CACHE_TAG };
