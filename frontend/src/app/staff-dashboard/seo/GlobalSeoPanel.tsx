"use client";

import { DYNAMIC_SEO_KEYS, STATIC_SEO_KEYS } from "@/lib/seo/defaultSeoContent";
import SeoJsonSectionGrid from "./SeoJsonSectionGrid";

export default function GlobalSeoPanel() {
  return (
    <SeoJsonSectionGrid
      sectionKeys={STATIC_SEO_KEYS}
      description="Fixed site-wide structured data and geo tags injected in the root layout. These rarely change."
      loadingMessage="Loading static SEO settings…"
    />
  );
}

/** Re-export for PageSeoPanel */
export { DYNAMIC_SEO_KEYS, STATIC_SEO_KEYS };
