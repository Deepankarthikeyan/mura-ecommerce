/** URL segment for storefront product detail. Prefer title-based slug; fall back to stored slug or productId. */
export function productTitleToUrlSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export type ShopProductLinkFields = {
  title?: string;
  slug?: string;
  productId?: string;
  /** Set by API after save; unique among products (may differ from title-only slug). */
  urlSlug?: string;
};

export function shopProductPathSegment(product: ShopProductLinkFields): string {
  const stored = String(product.urlSlug ?? "").trim();
  if (stored.length > 0) {
    return stored;
  }
  const fromTitle = productTitleToUrlSlug(String(product.title ?? "").trim());
  if (fromTitle.length > 0) {
    return fromTitle;
  }
  const fallback = String(product.slug ?? product.productId ?? "").trim();
  return fallback.length > 0 ? fallback : "product";
}
