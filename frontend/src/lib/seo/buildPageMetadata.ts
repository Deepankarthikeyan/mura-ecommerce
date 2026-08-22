import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import { getSeoPagesMap } from "@/functions/mongodbOperations";
import { loadMergedSeoSections } from "./loadSeoSettings";
import { getDefaultSeoContent } from "./defaultSeoContent";
import {
  getDefaultFullPageSeoConfig,
  mergePageSeoConfigs,
  normalizePageSeoConfig,
} from "./pageSeoForm";
import {
  BLOG_SEO_TEMPLATE_PATH,
  PRODUCT_SEO_TEMPLATE_PATH,
  normalizeSeoPath,
  type PageSeoConfig,
  type PageSeoOg,
} from "./pageSeoTypes";
import { applySeoTemplate, stripHtml, truncateText } from "./templateEngine";
import { resolveProductListingImage } from "../shopProductDisplay";
import {
  MURAI_FAVICON,
  MURAI_HOME_TITLE,
  MURAI_OG_IMAGE,
  MURAI_SITE_DESCRIPTION,
  MURAI_SITE_NAME,
} from "@/data/siteBrand";

export const SEO_PAGES_CACHE_TAG = "seo-pages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aathithyaherbal.com";
const SITE_NAME = MURAI_SITE_NAME;
const DEFAULT_OG_IMAGE = MURAI_OG_IMAGE;

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

function parsePageSeoConfig(raw: string | undefined): PageSeoConfig | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw.trim());
    return normalizePageSeoConfig(parsed);
  } catch {
    return null;
  }
}

function firstImageUrl(images?: PageSeoOg["images"]): string | undefined {
  if (!images?.length) return undefined;
  const first = images[0];
  if (typeof first === "string") return first;
  return first?.url;
}

async function loadSeoPagesMapUncached(): Promise<Record<string, string>> {
  try {
    return await getSeoPagesMap();
  } catch {
    return {};
  }
}

export const loadSeoPagesMapCached = unstable_cache(
  loadSeoPagesMapUncached,
  ["seo-pages-map"],
  { revalidate: 60, tags: [SEO_PAGES_CACHE_TAG] },
);

export async function resolvePageSeoConfig(
  path: string,
  options?: { templatePath?: string },
): Promise<PageSeoConfig> {
  const normalized = normalizeSeoPath(path);
  const pagesMap = await loadSeoPagesMapCached();
  const saved = parsePageSeoConfig(pagesMap[normalized]);

  if (options?.templatePath) {
    const templateNormalized = normalizeSeoPath(options.templatePath);
    const templateDefaults = getDefaultFullPageSeoConfig(templateNormalized);
    const templateSaved = parsePageSeoConfig(pagesMap[templateNormalized]);
    const templateMerged = mergePageSeoConfigs(templateDefaults, templateSaved);
    if (saved) {
      return mergePageSeoConfigs(templateMerged, saved);
    }
    return templateMerged;
  }

  const defaults = getDefaultFullPageSeoConfig(normalized);
  return mergePageSeoConfigs(defaults, saved);
}

function resolveImageUrl(image: string | undefined, fallback?: string): string | undefined {
  const raw = image?.trim() || fallback?.trim();
  if (!raw) return undefined;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return raw.startsWith("/") ? raw : `/${raw.replace(/^\.?\/*/, "")}`;
}

function productImageSrc(product: {
  image?: string | null;
  bannerImg?: string | string[] | null;
}): string {
  return resolveProductListingImage(product, DEFAULT_OG_IMAGE);
}

function normalizeCanonicalPath(
  configured: string | undefined,
  fallbackPath: string,
): string {
  const url = configured?.trim();
  if (!url) return fallbackPath;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const base = new URL(SITE_URL);
      const parsed = new URL(url);
      if (parsed.origin === base.origin) {
        return `${parsed.pathname}${parsed.search}${parsed.hash}` || "/";
      }
    } catch {
      return fallbackPath;
    }
  }
  return url.startsWith("/") ? url : `/${url}`;
}

export type BuildPageMetadataOptions = {
  variables?: Record<string, string | undefined>;
  canonicalPath?: string;
  image?: string;
  ogType?: "website" | "article";
  /** When set, unresolved fields fall back to this template path (e.g. product/blog templates). */
  templatePath?: string;
};

export async function buildPageMetadataForPath(
  path: string,
  options: BuildPageMetadataOptions = {},
): Promise<Metadata> {
  const normalized = normalizeSeoPath(path);
  const canonicalPath = options.canonicalPath ?? normalized;
  const pageSeo = await resolvePageSeoConfig(normalized, {
    templatePath: options.templatePath,
  });

  const sections = await loadMergedSeoSections();
  const defaults = getDefaultSeoContent();
  const globalBasic = parseJson<{ title?: string; description?: string; keywords?: string }>(
    sections.basic ?? defaults.basic,
    {},
  );
  const siteName =
    options.variables?.siteName?.trim() ||
    pageSeo.og?.siteName?.trim() ||
    globalBasic.title?.trim() ||
    MURAI_HOME_TITLE;

  const vars: Record<string, string | undefined> = {
    siteName,
    ...options.variables,
  };

  const titleRaw = applySeoTemplate(pageSeo.basic?.title, vars);
  const descriptionRaw = applySeoTemplate(pageSeo.basic?.description, vars);
  const keywordsRaw = applySeoTemplate(pageSeo.basic?.keywords, vars);

  const ogTitleRaw = applySeoTemplate(
    pageSeo.og?.title ?? pageSeo.basic?.title,
    vars,
  );
  const ogDescriptionRaw = applySeoTemplate(
    pageSeo.og?.description ?? pageSeo.basic?.description,
    vars,
  );
  const twitterTitleRaw = applySeoTemplate(
    pageSeo.twitter?.title ?? pageSeo.basic?.title,
    vars,
  );
  const twitterDescriptionRaw = applySeoTemplate(
    pageSeo.twitter?.description ?? pageSeo.basic?.description,
    vars,
  );

  const title = titleRaw || (normalized === "/" ? MURAI_HOME_TITLE : siteName);
  const description =
    truncateText(descriptionRaw, 160) ||
    truncateText(globalBasic.description, 160) ||
    MURAI_SITE_DESCRIPTION ||
    undefined;
  const keywords = keywordsRaw || globalBasic.keywords;

  const ogImage = resolveImageUrl(
    applySeoTemplate(firstImageUrl(pageSeo.og?.images), vars),
    options.image ?? DEFAULT_OG_IMAGE,
  );
  const twitterImage = resolveImageUrl(
    applySeoTemplate(firstImageUrl(pageSeo.twitter?.images), vars),
    options.image ?? ogImage,
  );

  const ogType: "website" | "article" =
    options.ogType ??
    (pageSeo.og?.type === "article" ? "article" : "website");

  const resolvedTitle = title || siteName;
  const canonical = normalizeCanonicalPath(pageSeo.canonical?.url, canonicalPath);

  const metadata: Metadata = {
    ...(title ? { title } : {}),
    description,
    keywords: keywords || undefined,
    alternates: { canonical },
    icons: {
      icon: MURAI_FAVICON,
      shortcut: MURAI_FAVICON,
      apple: MURAI_FAVICON,
    },
    openGraph: {
      title: ogTitleRaw || resolvedTitle,
      description: truncateText(ogDescriptionRaw, 200) || description,
      type: ogType,
      url: applySeoTemplate(pageSeo.og?.url, vars) || canonical,
      siteName: pageSeo.og?.siteName || siteName,
      locale: pageSeo.og?.locale || "en_IN",
      images: ogImage ? [{ url: ogImage, alt: resolvedTitle }] : undefined,
    },
    twitter: {
      card:
        (pageSeo.twitter?.card as "summary_large_image" | "summary") ??
        "summary_large_image",
      title: twitterTitleRaw || resolvedTitle,
      description: truncateText(twitterDescriptionRaw, 200) || description,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };

  if (pageSeo.noindex) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export type PageDynamicJsonLd = {
  service: Record<string, unknown> | null;
  faq: Record<string, unknown> | null;
  review: Record<string, unknown> | null;
};

function parseGlobalJsonLd(key: "service" | "faq" | "review"): Record<string, unknown> | null {
  const sections = getDefaultSeoContent();
  try {
    const raw = sections[key];
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      if (Object.keys(parsed as object).length === 0) return null;
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }
  return null;
}

export async function resolvePageDynamicJsonLd(
  path: string,
  options?: { templatePath?: string },
): Promise<PageDynamicJsonLd> {
  const pageSeo = await resolvePageSeoConfig(path, {
    templatePath: options?.templatePath,
  });

  let service = pageSeo.service ?? null;
  let faq = pageSeo.faq ?? null;
  let review = pageSeo.review ?? null;

  if (!service || !faq || !review) {
    const sections = await loadMergedSeoSections();
    const defaults = getDefaultSeoContent();

    if (!service) {
      service = parseJson<Record<string, unknown> | null>(
        sections.service ?? defaults.service,
        parseGlobalJsonLd("service"),
      );
    }
    if (!faq) {
      faq = parseJson<Record<string, unknown> | null>(
        sections.faq ?? defaults.faq,
        parseGlobalJsonLd("faq"),
      );
    }
    if (!review) {
      review = parseJson<Record<string, unknown> | null>(
        sections.review ?? defaults.review,
        parseGlobalJsonLd("review"),
      );
    }
  }

  return { service, faq, review };
}

export type ProductLike = {
  title?: string;
  description?: string;
  category?: string;
  price?: string | number;
  bannerImg?: string | string[] | null;
  image?: string;
  urlSlug?: string;
  slug?: string;
  productId?: string;
};

export type BlogPostLike = {
  id?: number | string;
  slug?: string;
  title?: string;
  descripTion?: string;
  description?: string;
  category?: string;
  author?: string;
  bannerImg?: string;
  image?: string;
};

function findBlogPostBySlug(slug: string, posts: BlogPostLike[]): BlogPostLike | undefined {
  const norm = slug.trim().toLowerCase();
  return posts.find(
    (entry) =>
      entry.slug === slug ||
      String(entry.slug ?? "").toLowerCase() === norm ||
      String(entry.id) === slug,
  );
}

export function blogPostVariables(
  post: BlogPostLike | null | undefined,
  siteName = SITE_NAME,
): Record<string, string> {
  const description = stripHtml(post?.descripTion ?? post?.description, 160);
  return {
    title: String(post?.title ?? "Blog post").trim(),
    description: description || String(post?.title ?? "").trim(),
    category: String(post?.category ?? "Wellness").trim(),
    author: String(post?.author ?? siteName).trim(),
    siteName,
  };
}

export function productVariables(
  product: ProductLike | null | undefined,
  siteName = SITE_NAME,
): Record<string, string> {
  const description = stripHtml(String(product?.description ?? ""), 160);
  return {
    title: String(product?.title ?? "Product").trim(),
    description: description || String(product?.title ?? "Product").trim(),
    category: String(product?.category ?? "Herbal").trim(),
    price: String(product?.price ?? "").replace(/,/g, "").trim(),
    siteName,
  };
}

export async function buildProductPageMetadata(
  product: ProductLike | null,
  slug: string,
): Promise<Metadata> {
  const canonicalSlug =
    String(product?.urlSlug ?? product?.slug ?? slug).trim() || slug;
  const canonicalPath = `/shop/${canonicalSlug}`;
  const image = product
    ? productImageSrc(product)
    : DEFAULT_OG_IMAGE;
  const ogImage = resolveImageUrl(image, DEFAULT_OG_IMAGE);

  if (!product) {
    return {
      title: "Product not found",
      alternates: { canonical: canonicalPath },
    };
  }

  return buildPageMetadataForPath(canonicalPath, {
    variables: productVariables(product),
    canonicalPath,
    image: ogImage,
    ogType: "website",
    templatePath: PRODUCT_SEO_TEMPLATE_PATH,
  });
}

export async function buildBlogPostMetadata(
  post: BlogPostLike | null | undefined,
  slug: string,
  allPosts?: BlogPostLike[],
): Promise<Metadata> {
  const resolved =
    post ?? (allPosts ? findBlogPostBySlug(slug, allPosts) : undefined);
  const canonicalPath = `/blog/${resolved?.slug ?? slug}`;
  const imagePath = resolved?.bannerImg ?? resolved?.image;
  const image = imagePath
    ? resolveImageUrl(String(imagePath), DEFAULT_OG_IMAGE)
    : DEFAULT_OG_IMAGE;
  return buildPageMetadataForPath(canonicalPath, {
    variables: blogPostVariables(resolved),
    canonicalPath,
    image,
    ogType: "article",
    templatePath: BLOG_SEO_TEMPLATE_PATH,
  });
}

export function buildProductJsonLd(
  product: ProductLike,
  slug: string,
): Record<string, unknown> | null {
  const name = String(product.title ?? "").trim();
  if (!name) return null;

  const canonicalSlug =
    String(product.urlSlug ?? product.slug ?? slug).trim() || slug;
  const image = productImageSrc(product);
  const priceRaw = String(product.price ?? "").replace(/,/g, "").trim();
  const price = parseFloat(priceRaw);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: stripHtml(String(product.description ?? ""), 500) || name,
    image: new URL(image, SITE_URL).href,
    url: new URL(`/shop/${canonicalSlug}`, SITE_URL).href,
    brand: { "@type": "Brand", name: SITE_NAME },
  };

  if (product.category?.trim()) schema.category = product.category.trim();

  if (Number.isFinite(price) && price > 0) {
    schema.offers = {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: new URL(`/shop/${canonicalSlug}`, SITE_URL).href,
    };
  }

  return schema;
}

export function staticPageMetadata(path: string) {
  return async (): Promise<Metadata> => buildPageMetadataForPath(path);
}
