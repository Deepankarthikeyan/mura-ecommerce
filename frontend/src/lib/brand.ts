const LOCAL_HOST = /localhost|127\.0\.0\.1/i;
const LEGACY_BRAND =
  /aathithya|authentic herbal|herbal products online|wellness products delivered worldwide/i;

function firstPublicUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim().replace(/\/+$/, "");
    if (!value || !/^https?:\/\//i.test(value) || LOCAL_HOST.test(value)) continue;
    return value;
  }
  const vercel = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");
  if (vercel && !LOCAL_HOST.test(vercel)) return `https://${vercel}`;
  if (process.env.NODE_ENV === "production") return "https://mura-dev.netlify.app";
  return "http://localhost:3000";
}

export const SITE_NAME = "MuRa@23";
export const SITE_DESCRIPTION =
  "India's finest sale sarees - silk, cotton, Banarasi, Kanjivaram and designer sarees at unbeatable prices. Handcrafted with love in India.";
export const SITE_URL = firstPublicUrl();
export const SITE_LOGO = "/murai/mura-newlogo.png";
export const SITE_FAVICON = "/murai/mura-newlogo.png";
export const SITE_EMAIL = "murapodanur@gmail.com";
export const SITE_PHONE = "02 123 333 444";
export const SITE_KEYWORDS = [
  "MuRa@23",
  "MuRa sarees",
  "sale sarees",
  "silk sarees",
  "cotton sarees",
  "Banarasi sarees",
  "Kanjivaram sarees",
  "designer sarees",
  "Podanur sarees",
  "Coimbatore sarees",
  "Tamil Nadu sarees",
  "handwoven sarees",
  "buy sarees online",
  "saree sale India",
].join(", ");

export function isLegacyBrandText(value: string | undefined | null): boolean {
  return Boolean(value && LEGACY_BRAND.test(value));
}

export function toPublicAssetUrl(path?: string | null, fallback = SITE_LOGO): string {
  const raw = (path ?? "").trim() || fallback;
  if (isLegacyBrandText(raw)) {
    return new URL(fallback, `${SITE_URL}/`).href;
  }
  try {
    if (/^https?:\/\//i.test(raw)) {
      const parsed = new URL(raw);
      if (LOCAL_HOST.test(parsed.hostname)) {
        return new URL(`${parsed.pathname}${parsed.search}`, `${SITE_URL}/`).href;
      }
      return parsed.href;
    }
  } catch {
    /* fall through */
  }
  const rel = raw.startsWith("/") ? raw : `/${raw.replace(/^\.?\/*/, "")}`;
  return new URL(rel, `${SITE_URL}/`).href;
}

export function rewritePublicUrls<T>(value: T): T {
  try {
    const rewritten = JSON.stringify(value)
      .replace(/https?:\/\/localhost(?::\d+)?/gi, SITE_URL)
      .replace(/https?:\/\/127\.0\.0\.1(?::\d+)?/gi, SITE_URL);
    return JSON.parse(rewritten) as T;
  } catch {
    return value;
  }
}
