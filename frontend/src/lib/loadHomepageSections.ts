import { unstable_cache } from "next/cache";
import { getHomepageSectionSettings } from "@/functions/mongodbOperations";
import {
  HOMEPAGE_SECTIONS_CACHE_TAG,
  parseHomepageSections,
  type HomepageSectionsConfig,
} from "./homepageSections";

async function loadHomepageSectionsUncached(): Promise<HomepageSectionsConfig> {
  try {
    const saved = await getHomepageSectionSettings();
    return parseHomepageSections(saved);
  } catch {
    return parseHomepageSections(null);
  }
}

export const loadHomepageSections = unstable_cache(
  loadHomepageSectionsUncached,
  ["homepage-sections"],
  { revalidate: 60, tags: [HOMEPAGE_SECTIONS_CACHE_TAG] },
);

export { HOMEPAGE_SECTIONS_CACHE_TAG };
