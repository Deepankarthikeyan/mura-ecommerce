import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { getSeoSettings } from "@/functions/mongodbOperations";
import {
  getDefaultSeoContent,
  type SeoSectionKey,
} from "./defaultSeoContent";
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
  MURAI_SITE_NAME,
} from "@/data/siteBrand";

export const SEO_SETTINGS_CACHE_TAG = "seo-settings";

const FAVICON = MURAI_FAVICON;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aathithyaherbal.com";
const OG_LOGO = MURAI_OG_IMAGE;

type BasicConfig = {
  title?: string;
  description?: string;
  keywords?: string;
  authors?: Array<{ name?: string }>;
};

type GeoConfig = {
  "geo.region"?: string;
  "geo.placename"?: string;
  language?: string;
};

type OgConfig = {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  siteName?: string;
  locale?: string;
  images?: Array<{ url?: string; alt?: string } | string>;
  logo?: string;
};

type TwitterConfig = {
  card?: "summary" | "summary_large_image" | "app" | "player";
  title?: string;
  description?: string;
  images?: Array<string | { url?: string }>;
};

type CanonicalConfig = {
  url?: string;
};

function parseJson<T>(raw: string, fallback: T): T {
  try {
    const parsed = JSON.parse(raw.trim() || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {
    /* use fallback */
  }
  return fallback;
}

function parseJsonLd(raw: string, fallback: Record<string, unknown>): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw.trim() || "{}");
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      Object.keys(parsed as object).length > 0
    ) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function parseOptionalJsonLd(
  raw: string,
  fallback: Record<string, unknown> | null,
): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw.trim() || "{}");
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      Object.keys(parsed as object).length > 0
    ) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return fallback;
  }
  return fallback;
}

function normalizeCanonicalUrl(raw: string): string {
  const config = parseJson<CanonicalConfig>(raw, {});
  const url = typeof config.url === "string" ? config.url.trim() : "";
  if (!url) return "/";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const base = new URL(SITE_URL);
      const parsed = new URL(url);
      if (parsed.origin === base.origin) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
      }
    } catch {
      return "/";
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
}

function mapOgImages(images: OgConfig["images"]): NonNullable<Metadata["openGraph"]>["images"] {
  if (!images?.length) return undefined;
  return images.map((image) => {
    if (typeof image === "string") {
      return { url: image };
    }
    return {
      url: image.url ?? "",
      alt: image.alt,
    };
  });
}

function mapTwitterImages(images: TwitterConfig["images"]): string[] | undefined {
  if (!images?.length) return undefined;
  return images
    .map((image) => (typeof image === "string" ? image : image.url ?? ""))
    .filter(Boolean);
}

async function loadMergedSectionsUncached(): Promise<Record<SeoSectionKey, string>> {
  const defaults = getDefaultSeoContent();
  try {
    const saved = await getSeoSettings();
    return { ...defaults, ...saved };
  } catch {
    return defaults;
  }
}

export const loadMergedSeoSections = unstable_cache(
  loadMergedSectionsUncached,
  ["merged-seo-sections"],
  { revalidate: 60, tags: [SEO_SETTINGS_CACHE_TAG] },
);

function mergedSection(
  sections: Record<SeoSectionKey, string>,
  key: SeoSectionKey,
): string {
  return sections[key] ?? getDefaultSeoContent()[key];
}

export async function buildSiteMetadata(): Promise<Metadata> {
  const sections = await loadMergedSeoSections();
  const defaults = getDefaultSeoContent();

  const basic = parseJson<BasicConfig>(
    mergedSection(sections, "basic"),
    parseJson(defaults.basic, {}),
  );
  const geo = parseJson<GeoConfig>(
    mergedSection(sections, "geo"),
    parseJson(defaults.geo, {}),
  );
  const og = parseJson<OgConfig>(mergedSection(sections, "og"), parseJson(defaults.og, {}));
  const twitter = parseJson<TwitterConfig>(
    mergedSection(sections, "twitter"),
    parseJson(defaults.twitter, {}),
  );
  const canonical = mergedSection(sections, "canonical");

  const siteName = basic.title?.trim() || MURAI_HOME_TITLE;
  const ogLogo = og.logo?.trim();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${MURAI_SITE_NAME}`,
    },
    description: basic.description,
    keywords: basic.keywords,
    authors: basic.authors
      ?.map((author) => (author.name ? { name: author.name } : null))
      .filter((author): author is { name: string } => author !== null),
    icons: {
      icon: FAVICON,
      shortcut: FAVICON,
      apple: FAVICON,
    },
    alternates: {
      canonical: normalizeCanonicalUrl(canonical),
    },
    verification: {
      google: "3-44r9XqneEvefAd8c--jB9SHrwy3H2dVGELwh6bSg8",
    },
    openGraph: {
      title: og.title ?? siteName,
      description: og.description ?? basic.description,
      type: (og.type as "website") ?? "website",
      url: og.url ?? "/",
      siteName: og.siteName ?? siteName,
      locale: og.locale ?? "en_IN",
      images: mapOgImages(og.images),
    },
    twitter: {
      card: twitter.card ?? "summary_large_image",
      title: twitter.title ?? siteName,
      description: twitter.description ?? basic.description,
      images: mapTwitterImages(twitter.images),
    },
    other: {
      author: siteName,
      "geo.region": geo["geo.region"] ?? "IN-TN",
      "geo.placename": geo["geo.placename"] ?? "Coimbatore, Tamil Nadu, India",
      language: geo.language ?? "en-IN",
      "og:logo": ogLogo || new URL(OG_LOGO, SITE_URL).href,
    },
  };
}

export type LiveSeoSchemas = {
  organization: Record<string, unknown>;
  website: Record<string, unknown>;
  localBusiness: Record<string, unknown>;
  service: Record<string, unknown> | null;
  faq: Record<string, unknown> | null;
  review: Record<string, unknown> | null;
};

export async function loadLiveSeoSchemas(): Promise<LiveSeoSchemas> {
  const sections = await loadMergedSeoSections();
  const defaults = getDefaultSeoContent();

  const organizationFallback = parseJsonLd(
    defaults.organization,
    organizationSchema() as Record<string, unknown>,
  );
  const websiteFallback = parseJsonLd(
    defaults.websiteSchema,
    websiteSchema() as Record<string, unknown>,
  );
  const localBusinessFallback = parseJsonLd(
    defaults.localBusiness,
    localBusinessSchema() as Record<string, unknown>,
  );
  const serviceFallback = parseJsonLd(
    defaults.service,
    serviceCatalogSchema() as Record<string, unknown>,
  );
  const faqFallback = parseJsonLd(defaults.faq, faqSchema() as Record<string, unknown>);

  const reviewDefault = reviewSchema();
  const reviewFallback = reviewDefault
    ? parseJsonLd(defaults.review, reviewDefault as Record<string, unknown>)
    : null;

  return {
    organization: parseJsonLd(mergedSection(sections, "organization"), organizationFallback),
    website: parseJsonLd(mergedSection(sections, "websiteSchema"), websiteFallback),
    localBusiness: parseJsonLd(mergedSection(sections, "localBusiness"), localBusinessFallback),
    service: parseJsonLd(mergedSection(sections, "service"), serviceFallback),
    faq: parseJsonLd(mergedSection(sections, "faq"), faqFallback),
    review: parseOptionalJsonLd(mergedSection(sections, "review"), reviewFallback),
  };
}
