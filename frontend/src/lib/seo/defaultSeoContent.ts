import {
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  reviewSchema,
  serviceCatalogSchema,
  websiteSchema,
} from "./organizationSchema";
import {
  MURAI_FAVICON,
  MURAI_HOME_TITLE,
  MURAI_OG_IMAGE,
  MURAI_SITE_DESCRIPTION,
  MURAI_SITE_NAME,
} from "@/data/siteBrand";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aathithyaherbal.com";
const SITE_NAME = MURAI_SITE_NAME;
const SITE_DESCRIPTION = MURAI_SITE_DESCRIPTION;
const SITE_KEYWORDS = [
  MURAI_SITE_NAME,
  "saree sale",
  "silk sarees",
  "cotton sarees",
  "designer sarees",
  "Banarasi sarees",
  "Kanjivaram sarees",
  "sarees online",
  "buy sarees online",
  "MuRa sarees",
  "festive saree sale",
  "handwoven sarees",
  "Indian sarees",
  "saree shop India",
].join(", ");
const OG_IMAGE = MURAI_OG_IMAGE;
const OG_LOGO = MURAI_OG_IMAGE;

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
      title: MURAI_HOME_TITLE,
      description: SITE_DESCRIPTION,
      keywords: SITE_KEYWORDS,
      authors: [{ name: SITE_NAME }],
    }),
    geo: prettyJson({
      "geo.region": "IN-TN",
      "geo.placename": "Coimbatore, Tamil Nadu, India",
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
