export type PageSeoBasic = {
  title?: string;
  description?: string;
  keywords?: string;
  authors?: Array<{ name?: string }>;
};

export type PageSeoOg = {
  title?: string;
  description?: string;
  type?: string;
  url?: string;
  siteName?: string;
  locale?: string;
  images?: Array<{ url?: string; alt?: string } | string>;
  logo?: string;
};

export type PageSeoTwitter = {
  card?: string;
  title?: string;
  description?: string;
  images?: Array<string | { url?: string }>;
};

export type PageSeoCanonical = {
  url?: string;
};

/** Full per-path SEO including all dynamic sections. */
export type PageSeoConfig = {
  basic?: PageSeoBasic;
  og?: PageSeoOg;
  twitter?: PageSeoTwitter;
  canonical?: PageSeoCanonical;
  service?: Record<string, unknown> | null;
  faq?: Record<string, unknown> | null;
  review?: Record<string, unknown> | null;
  noindex?: boolean;

  /** @deprecated Legacy flat fields — migrated on load */
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
};

export type SeoPathEntry = {
  path: string;
  label: string;
  kind: "static" | "template";
};

export const PRODUCT_SEO_TEMPLATE_PATH = "__template:product";
export const BLOG_SEO_TEMPLATE_PATH = "__template:blog";

export const KNOWN_STATIC_SEO_PATHS: SeoPathEntry[] = [
  { path: "/", label: "Home", kind: "static" },
  { path: "/about", label: "About", kind: "static" },
  { path: "/contact", label: "Contact", kind: "static" },
  { path: "/blog", label: "Blog index", kind: "static" },
  { path: "/shop", label: "Shop", kind: "static" },
  { path: "/store", label: "Store", kind: "static" },
  { path: "/privacy-policy", label: "Privacy policy", kind: "static" },
  { path: "/terms-condition", label: "Terms & conditions", kind: "static" },
  { path: "/cookies-policy", label: "Cookies policy", kind: "static" },
  { path: "/shipping-policy", label: "Shipping policy", kind: "static" },
  { path: "/return-refund-replacement-policy", label: "Return & refund policy", kind: "static" },
];

export const KNOWN_TEMPLATE_SEO_PATHS: SeoPathEntry[] = [
  { path: PRODUCT_SEO_TEMPLATE_PATH, label: "Product template", kind: "template" },
  { path: BLOG_SEO_TEMPLATE_PATH, label: "Blog template", kind: "template" },
];

export const ALL_MANAGED_SEO_PATHS: SeoPathEntry[] = [
  ...KNOWN_STATIC_SEO_PATHS,
  ...KNOWN_TEMPLATE_SEO_PATHS,
];

export function normalizeSeoPath(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "/";
  if (trimmed.startsWith("__template:")) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      return new URL(trimmed).pathname || "/";
    } catch {
      return "/";
    }
  }
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+$/, "") || "/";
}

/** Legacy flat defaults for path-specific title/description hints. */
export function getDefaultPageSeoConfig(path: string): {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  noindex?: boolean;
} | null {
  const normalized = normalizeSeoPath(path);

  const staticDefaults: Record<
    string,
    {
      title?: string;
      description?: string;
      keywords?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogType?: string;
      twitterTitle?: string;
      twitterDescription?: string;
    }
  > = {
    "/": {
      description:
        "Shop authentic herbal products online at Aathithya Herbal. Natural supplements and wellness products delivered worldwide.",
    },
    "/about": {
      title: "About Us",
      description:
        "Learn about Aathithya Herbal — your trusted herbal store since 2016.",
    },
    "/contact": {
      title: "Contact Us",
      description: "Contact Aathithya Herbal in Coimbatore for herbal product support.",
    },
    "/blog": {
      title: "Blog",
      description: "Herbal wellness tips and articles from Aathithya Herbal.",
    },
    "/shop": {
      title: "Shop Herbal Products",
      description: "Browse authentic herbal products at Aathithya Herbal.",
    },
    "/store": {
      title: "Our Store",
      description: "Visit Aathithya Herbal online store.",
    },
    "/privacy-policy": { title: "Privacy Policy", description: "Privacy policy for Aathithya Herbal." },
    "/terms-condition": { title: "Terms & Conditions", description: "Terms for Aathithya Herbal online store." },
    "/cookies-policy": { title: "Cookies Policy", description: "Cookies policy for Aathithya Herbal." },
    "/shipping-policy": { title: "Shipping Policy", description: "Shipping information for Aathithya Herbal orders." },
    "/return-refund-replacement-policy": {
      title: "Return & Refund Policy",
      description: "Return and refund policy for Aathithya Herbal.",
    },
    [PRODUCT_SEO_TEMPLATE_PATH]: {
      title: "{title}",
      description: "{description}",
      keywords: "{title}, {category}, herbal products, {siteName}",
      ogTitle: "{title} | {siteName}",
      ogDescription: "{description}",
      ogType: "website",
      twitterTitle: "{title} | {siteName}",
      twitterDescription: "{description}",
    },
    [BLOG_SEO_TEMPLATE_PATH]: {
      title: "{title}",
      description: "{description}",
      keywords: "{title}, {category}, herbal blog, {siteName}",
      ogTitle: "{title} | {siteName}",
      ogDescription: "{description}",
      ogType: "article",
      twitterTitle: "{title} | {siteName}",
      twitterDescription: "{description}",
    },
  };

  return staticDefaults[normalized] ?? null;
}
