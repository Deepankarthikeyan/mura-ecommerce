const FALLBACK_PRODUCT_IMAGE = "/assets/images/logo/logo-1-jpg.jpeg";

/** Old local product image folder — never use these paths. */
const LEGACY_LOCAL_PRODUCT_IMAGE = /(?:^|\/)assets\/images\/products\//i;

export function isLegacyLocalProductImagePath(
  raw: string | undefined | null,
): boolean {
  const s = String(raw ?? "").trim().replace(/\\/g, "/");
  return Boolean(s) && LEGACY_LOCAL_PRODUCT_IMAGE.test(s);
}

/** Normalize a stored product image path or absolute URL for use in <img src>. */
export function normalizeProductImagePath(raw: string | undefined | null): string {
  const s = String(raw ?? "").trim();
  if (!s) return "";
  // Drop legacy local product files (not shipped in public/).
  if (isLegacyLocalProductImagePath(s)) return "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `/${s.replace(/^\.?\/*/, "")}`;
}

function bannerImgList(bannerImg?: string | string[] | null): string[] {
  if (!bannerImg) return [];
  const raw = Array.isArray(bannerImg) ? bannerImg : [bannerImg];
  return raw
    .map((entry) => normalizeProductImagePath(entry))
    .filter(Boolean);
}

export type ProductImageFields = {
  image?: string | null;
  bannerImg?: string | string[] | null;
};

export type ProductAdMediaFields = {
  productAdMediaUrl?: string | null;
};

/** Sidebar promo ad URL on the product detail page, or empty when unset. */
export function resolveProductAdMediaUrl(
  product: ProductAdMediaFields | null | undefined,
): string {
  return normalizeProductImagePath(product?.productAdMediaUrl);
}

/**
 * Listing / card / detail image from `image` only.
 * Falls back to legacy `bannerImg[0]` when `image` is empty.
 */
export function resolveProductListingImage(
  product: ProductImageFields | null | undefined,
  fallback = FALLBACK_PRODUCT_IMAGE,
): string {
  const main = normalizeProductImagePath(product?.image);
  if (main) return main;
  const legacy = bannerImgList(product?.bannerImg)[0];
  return legacy || fallback;
}

/**
 * Product detail gallery — ordered URLs for main image + thumbnails.
 * Uses primary `image` first, then `bannerImg` entries (Image 1–4 from inventory),
 * de-duplicated, max 4. Legacy `/assets/images/products/` paths are ignored.
 */
export function resolveProductGalleryImages(
  product: ProductImageFields | null | undefined,
  options?: { count?: number },
): string[] {
  const count = options?.count ?? 4;
  const gallery: string[] = [];
  const push = (src: string) => {
    if (src && !gallery.includes(src)) gallery.push(src);
  };

  push(normalizeProductImagePath(product?.image));
  bannerImgList(product?.bannerImg).forEach(push);

  if (gallery.length === 0) {
    return [FALLBACK_PRODUCT_IMAGE];
  }

  return gallery.slice(0, count);
}

/** Shop card: parse ₹ strings / numbers from Mongo for comparisons and display. */
export function parseMoneyAmount(raw: string | number | undefined | null): number | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const n = parseFloat(String(raw).replace(/,/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

export function shouldShowMrpStrike(
  saleRaw: string | number | undefined,
  mrpRaw: string | number | undefined
): boolean {
  const sale = parseMoneyAmount(saleRaw);
  const mrp = parseMoneyAmount(mrpRaw);
  return sale !== null && mrp !== null && mrp > sale;
}

export function formatMrpStrikeDisplay(mrpRaw: string | number | undefined): string {
  const mrp = parseMoneyAmount(mrpRaw);
  if (mrp === null) return "";
  return mrp.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Badge %: prefer DB discountPercentage; else derive from MRP vs sale (rounded), same as staff inventory.
 */
export function badgeDiscountPercent(
  discountRaw: string | number | undefined,
  mrpRaw: string | number | undefined,
  priceRaw: string | number | undefined
): number | null {
  const d = Number(discountRaw);
  if (Number.isFinite(d) && d > 0) return Math.round(d);
  const mrp = parseMoneyAmount(mrpRaw);
  const price = parseMoneyAmount(priceRaw);
  if (mrp === null || price === null || mrp <= 0) return null;
  const pct = ((mrp - price) / mrp) * 100;
  if (!Number.isFinite(pct) || pct <= 0) return null;
  return Math.round(pct);
}
