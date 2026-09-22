import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOGO,
  SITE_NAME,
  SITE_URL,
} from "../brand";
import {
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  reviewSchema,
  serviceCatalogSchema,
  websiteSchema,
} from "./organizationSchema";

const OG_IMAGE = SITE_LOGO;
const OG_LOGO = SITE_LOGO;

export const SEO_SECTION_KEYS = [
  "basic",
  "geo",
  "og",
  "twitter",
  "canonical",
  "organization",
  "websiteSchema",
  "localBusiness",
  "service",
  "faq",
  "review",
] as const;

export type SeoSectionKey = (typeof SEO_SECTION_KEYS)[number];

export const SEO_SECTION_LABELS: Record<SeoSectionKey, string> = {
  basic: "BASIC",
  geo: "GEO",
  og: "OG",
  twitter: "TWITTER",
  canonical: "CANONICAL",
  organization: "ORGANIZATION",
  websiteSchema: "WEBSITE SCHEMA",
  localBusiness: "LOCAL BUSINESS",
  service: "SERVICE",
  faq: "FAQ",
  review: "REVIEW",
};

export type SeoSectionBadge = "DYNAMIC" | "STATIC";

export const SEO_SECTION_BADGES: Record<SeoSectionKey, SeoSectionBadge> = {
  basic: "DYNAMIC",
  geo: "STATIC",
  og: "DYNAMIC",
  twitter: "DYNAMIC",
  canonical: "DYNAMIC",
  organization: "STATIC",
  websiteSchema: "STATIC",
  localBusiness: "STATIC",
  service: "DYNAMIC",
  faq: "DYNAMIC",
  review: "DYNAMIC",
};

export const STATIC_SEO_KEYS = SEO_SECTION_KEYS.filter(
  (key) => SEO_SECTION_BADGES[key] === "STATIC",
);

export const DYNAMIC_SEO_KEYS = SEO_SECTION_KEYS.filter(
  (key) => SEO_SECTION_BADGES[key] === "DYNAMIC",
);

function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function getDefaultSeoContent(): Record<SeoSectionKey, string> {
  const storeReviewSchema = reviewSchema();

  return {
    basic: prettyJson({
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      keywords: SITE_KEYWORDS,
      authors: [{ name: SITE_NAME }],
    }),
    geo: prettyJson({
      "geo.region": "IN-TN",
      "geo.placename": "Podanur, Coimbatore, Tamil Nadu, India",
      language: "en-IN",
    }),
    og: prettyJson({
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      type: "website",
      url: "/",
      siteName: SITE_NAME,
      locale: "en_IN",
      images: [{ url: OG_IMAGE, alt: SITE_NAME }],
      logo: new URL(OG_LOGO, SITE_URL).href,
    }),
    twitter: prettyJson({
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [OG_IMAGE],
    }),
    canonical: prettyJson({
      url: `${SITE_URL}/`,
    }),
    organization: prettyJson(organizationSchema()),
    websiteSchema: prettyJson(websiteSchema()),
    localBusiness: prettyJson(localBusinessSchema()),
    service: prettyJson(serviceCatalogSchema()),
    faq: prettyJson(faqSchema()),
    review: prettyJson(storeReviewSchema ?? {}),
  };
}
