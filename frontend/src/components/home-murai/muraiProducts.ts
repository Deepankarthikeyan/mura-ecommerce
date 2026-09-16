import { shopProductPathSegment } from "@/lib/productSlug";
import { parseMoneyAmount, resolveProductListingImage } from "@/lib/shopProductDisplay";
import type { MuraiSaree } from "./murai-data";

export type DbProduct = {
  _id?: string | { toString(): string };
  productId?: string;
  slug?: string;
  urlSlug?: string;
  title?: string;
  category?: string;
  price?: string | number;
  mrp?: string | number;
  image?: string;
  bannerImg?: string | string[];
  ratings?: number;
};

function numericProductId(product: DbProduct, index: number): number {
  const fromKey = Number(product.productId);
  if (Number.isFinite(fromKey) && fromKey > 0) return fromKey;
  const raw = typeof product._id === "string" ? product._id : product._id?.toString() ?? "";
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) || index + 1;
}

export function mapDbProductToMuraiSaree(raw: unknown, index: number): MuraiSaree | null {
  if (!raw || typeof raw !== "object") return null;
  const product = raw as DbProduct;
  const price = parseMoneyAmount(product.price) ?? 0;
  const mrp = parseMoneyAmount(product.mrp);
  const old = mrp != null && mrp > price ? mrp : price;
  const category = String(product.category ?? "").trim();
  return {
    id: numericProductId(product, index),
    name: String(product.title ?? "").trim() || "Untitled",
    cat: category || "—",
    category,
    price,
    old,
    img: resolveProductListingImage(product),
    badge: old > price ? "SALE" : undefined,
    href: `/shop/${shopProductPathSegment(product)}`,
    ratings: typeof product.ratings === "number" ? product.ratings : undefined,
  };
}

export function mapApiProducts(raw: unknown): MuraiSaree[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(mapDbProductToMuraiSaree).filter((item): item is MuraiSaree => item != null);
}
