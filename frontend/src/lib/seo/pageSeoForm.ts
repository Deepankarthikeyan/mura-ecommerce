import { getDefaultSeoContent } from "./defaultSeoContent";
import {
  getDefaultPageSeoConfig,
  normalizeSeoPath,
  type PageSeoConfig,
} from "./pageSeoTypes";

export type PageSeoFormState = {
  basicTitle: string;
  basicDescription: string;
  basicKeywords: string;
  basicAuthors: string;
  ogTitle: string;
  ogDescription: string;
  ogType: string;
  ogUrl: string;
  ogSiteName: string;
  ogLocale: string;
  ogImage: string;
  ogLogo: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  serviceJson: string;
  faqJson: string;
  reviewJson: string;
  noindex: boolean;
};

function parseJsonObject(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw.trim() || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }
  return null;
}

function prettyJson(value: unknown): string {
  if (!value || (typeof value === "object" && Object.keys(value as object).length === 0)) {
    return "";
  }
  return JSON.stringify(value, null, 2);
}

function parseGlobalSection<T extends Record<string, unknown>>(key: string, fallback: T): T {
  try {
    const defaults = getDefaultSeoContent();
    const raw = defaults[key as keyof typeof defaults];
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as T;
    }
  } catch {
    /* use fallback */
  }
  return fallback;
}

/** Map legacy flat PageSeoConfig to nested shape. */
export function normalizePageSeoConfig(raw: unknown): PageSeoConfig {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const obj = raw as Record<string, unknown>;

  if (obj.basic || obj.og || obj.twitter || obj.canonical || obj.service || obj.faq || obj.review) {
    return raw as PageSeoConfig;
  }

  const legacy = raw as {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogType?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    noindex?: boolean;
  };

  return {
    basic: {
      title: legacy.title,
      description: legacy.description,
      keywords: legacy.keywords,
    },
    og: {
      title: legacy.ogTitle ?? legacy.title,
      description: legacy.ogDescription ?? legacy.description,
      type: legacy.ogType,
      images: legacy.ogImage ? [{ url: legacy.ogImage }] : undefined,
    },
    twitter: {
      title: legacy.twitterTitle ?? legacy.title,
      description: legacy.twitterDescription ?? legacy.description,
      images: legacy.twitterImage ? [legacy.twitterImage] : undefined,
    },
    noindex: legacy.noindex,
  };
}

export function getDefaultFullPageSeoConfig(path: string): PageSeoConfig {
  const normalized = normalizeSeoPath(path);
  const pathDefaults = getDefaultPageSeoConfig(normalized);

  const globalBasic = parseGlobalSection<{ title?: string; description?: string; keywords?: string; authors?: Array<{ name?: string }> }>("basic", {});
  const globalOg = parseGlobalSection<{
    title?: string;
    description?: string;
    type?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    images?: Array<{ url?: string; alt?: string } | string>;
    logo?: string;
  }>("og", {});
  const globalTwitter = parseGlobalSection<{
    card?: string;
    title?: string;
    description?: string;
    images?: Array<string | { url?: string }>;
  }>("twitter", {});

  let service: Record<string, unknown> | null = null;
  let faq: Record<string, unknown> | null = null;
  let review: Record<string, unknown> | null = null;

  try {
    service = JSON.parse(getDefaultSeoContent().service) as Record<string, unknown>;
  } catch {
    service = null;
  }
  try {
    faq = JSON.parse(getDefaultSeoContent().faq) as Record<string, unknown>;
  } catch {
    faq = null;
  }
  try {
    const reviewRaw = getDefaultSeoContent().review;
    const parsed = JSON.parse(reviewRaw);
    review =
      parsed && typeof parsed === "object" && Object.keys(parsed).length > 0
        ? (parsed as Record<string, unknown>)
        : null;
  } catch {
    review = null;
  }

  return {
    basic: {
      title: pathDefaults?.title ?? globalBasic.title,
      description: pathDefaults?.description ?? globalBasic.description,
      keywords: pathDefaults?.keywords ?? globalBasic.keywords,
      authors: globalBasic.authors,
    },
    og: {
      title: pathDefaults?.ogTitle ?? pathDefaults?.title ?? globalOg.title,
      description:
        pathDefaults?.ogDescription ?? pathDefaults?.description ?? globalOg.description,
      type: pathDefaults?.ogType ?? globalOg.type ?? "website",
      url: normalized,
      siteName: globalOg.siteName,
      locale: globalOg.locale,
      images: pathDefaults?.ogImage
        ? [{ url: pathDefaults.ogImage }]
        : globalOg.images,
      logo: globalOg.logo,
    },
    twitter: {
      card: globalTwitter.card ?? "summary_large_image",
      title: pathDefaults?.twitterTitle ?? pathDefaults?.title ?? globalTwitter.title,
      description:
        pathDefaults?.twitterDescription ??
        pathDefaults?.description ??
        globalTwitter.description,
      images: pathDefaults?.twitterImage
        ? [pathDefaults.twitterImage]
        : globalTwitter.images,
    },
    canonical: {
      url: normalized === "/" ? "/" : normalized,
    },
    service,
    faq,
    review,
    noindex: pathDefaults?.noindex ?? false,
  };
}

function pickString(...values: Array<string | undefined>): string {
  for (const v of values) {
    if (v?.trim()) return v.trim();
  }
  return "";
}

function firstImageUrl(images: unknown): string {
  if (!Array.isArray(images) || images.length === 0) return "";
  const first = images[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && "url" in first) {
    return String((first as { url?: string }).url ?? "");
  }
  return "";
}

export function mergePageSeoConfigs(
  base: PageSeoConfig,
  override: PageSeoConfig | null | undefined,
): PageSeoConfig {
  const o = override ?? {};
  return {
    basic: {
      title: pickString(o.basic?.title, base.basic?.title),
      description: pickString(o.basic?.description, base.basic?.description),
      keywords: pickString(o.basic?.keywords, base.basic?.keywords),
      authors: o.basic?.authors?.length ? o.basic.authors : base.basic?.authors,
    },
    og: {
      title: pickString(o.og?.title, base.og?.title),
      description: pickString(o.og?.description, base.og?.description),
      type: pickString(o.og?.type, base.og?.type),
      url: pickString(o.og?.url, base.og?.url),
      siteName: pickString(o.og?.siteName, base.og?.siteName),
      locale: pickString(o.og?.locale, base.og?.locale),
      images: o.og?.images?.length ? o.og.images : base.og?.images,
      logo: pickString(o.og?.logo, base.og?.logo),
    },
    twitter: {
      card: pickString(o.twitter?.card, base.twitter?.card),
      title: pickString(o.twitter?.title, base.twitter?.title),
      description: pickString(o.twitter?.description, base.twitter?.description),
      images: o.twitter?.images?.length ? o.twitter.images : base.twitter?.images,
    },
    canonical: {
      url: pickString(o.canonical?.url, base.canonical?.url),
    },
    service: o.service ?? base.service ?? null,
    faq: o.faq ?? base.faq ?? null,
    review: o.review ?? base.review ?? null,
    noindex: o.noindex ?? base.noindex ?? false,
  };
}

export function pageSeoConfigToFormState(config: PageSeoConfig): PageSeoFormState {
  const authors =
    config.basic?.authors
      ?.map((a) => a.name)
      .filter(Boolean)
      .join(", ") ?? "";

  return {
    basicTitle: config.basic?.title ?? "",
    basicDescription: config.basic?.description ?? "",
    basicKeywords: config.basic?.keywords ?? "",
    basicAuthors: authors,
    ogTitle: config.og?.title ?? "",
    ogDescription: config.og?.description ?? "",
    ogType: config.og?.type ?? "",
    ogUrl: config.og?.url ?? "",
    ogSiteName: config.og?.siteName ?? "",
    ogLocale: config.og?.locale ?? "",
    ogImage: firstImageUrl(config.og?.images),
    ogLogo: config.og?.logo ?? "",
    twitterCard: config.twitter?.card ?? "",
    twitterTitle: config.twitter?.title ?? "",
    twitterDescription: config.twitter?.description ?? "",
    twitterImage: firstImageUrl(config.twitter?.images),
    canonicalUrl: config.canonical?.url ?? "",
    serviceJson: prettyJson(config.service),
    faqJson: prettyJson(config.faq),
    reviewJson: prettyJson(config.review),
    noindex: config.noindex ?? false,
  };
}

export function formStateToPageSeoConfig(form: PageSeoFormState): PageSeoConfig {
  const authorNames = form.basicAuthors
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const config: PageSeoConfig = {
    basic: {
      title: form.basicTitle.trim() || undefined,
      description: form.basicDescription.trim() || undefined,
      keywords: form.basicKeywords.trim() || undefined,
      authors: authorNames.length
        ? authorNames.map((name) => ({ name }))
        : undefined,
    },
    og: {
      title: form.ogTitle.trim() || undefined,
      description: form.ogDescription.trim() || undefined,
      type: form.ogType.trim() || undefined,
      url: form.ogUrl.trim() || undefined,
      siteName: form.ogSiteName.trim() || undefined,
      locale: form.ogLocale.trim() || undefined,
      images: form.ogImage.trim() ? [{ url: form.ogImage.trim() }] : undefined,
      logo: form.ogLogo.trim() || undefined,
    },
    twitter: {
      card: form.twitterCard.trim() || undefined,
      title: form.twitterTitle.trim() || undefined,
      description: form.twitterDescription.trim() || undefined,
      images: form.twitterImage.trim() ? [form.twitterImage.trim()] : undefined,
    },
    canonical: {
      url: form.canonicalUrl.trim() || undefined,
    },
    noindex: form.noindex,
  };

  const service = parseJsonObject(form.serviceJson);
  const faq = parseJsonObject(form.faqJson);
  const review = parseJsonObject(form.reviewJson);

  if (service && Object.keys(service).length > 0) config.service = service;
  if (faq && Object.keys(faq).length > 0) config.faq = faq;
  if (review && Object.keys(review).length > 0) config.review = review;

  return config;
}

export function emptyPageSeoFormState(): PageSeoFormState {
  return pageSeoConfigToFormState({});
}
