import { shopProductPathSegment } from "@/lib/productSlug";
import {
  badgeDiscountPercent,
  parseMoneyAmount,
  resolveProductListingImage,
  shouldShowMrpStrike,
} from "@/lib/shopProductDisplay";
import type { StoreProduct } from "./types";

export function getStableProductId(product: StoreProduct): string {
  if (product._id) return String(product._id);
  if (product.productId) return String(product.productId);
  if (product.id != null) return String(product.id);
  return shopProductPathSegment(product);
}

export function getProductSlug(product: StoreProduct): string {
  return shopProductPathSegment(product);
}

export function formatInr(amount: string | number | undefined | null): string {
  const n = parseMoneyAmount(amount);
  if (n === null) return "₹0";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function productCardImage(product: StoreProduct): string {
  const fallback = "/murai/images/sarees/banarasi.webp";
  const img = resolveProductListingImage(product, fallback);
  if (img.includes("logo-1-jpg") || img.includes("aathithya") || img.includes("/assets/images/logo/")) {
    return fallback;
  }
  if (img.startsWith("/murai/") || img.startsWith("http")) return img;
  return img.startsWith("/") ? img : `/${img}`;
}

export function productCategoryKey(category?: string): string {
  const c = String(category ?? "").toLowerCase();
  if (c.includes("silk")) return "silk";
  if (c.includes("cotton")) return "cotton";
  if (c.includes("kanjivaram") || c.includes("kanchipuram")) return "kanjivaram";
  if (c.includes("designer") || c.includes("party")) return "party";
  return "all";
}

/** Display label on product cards — matches Murai reference `cat` field. */
export function productCategoryLabel(category?: string): string {
  const key = productCategoryKey(category);
  switch (key) {
    case "silk":
      return "Silk Saree";
    case "cotton":
      return "Cotton Saree";
    case "kanjivaram":
      return "Kanjivaram";
    case "party":
      return category?.toLowerCase().includes("designer") ? "Designer Saree" : "Party Wear";
    default:
      return category?.trim() || "Saree";
  }
}

/** Homepage tab panes — silk / cotton / designer+kanjivaram (reference sarees.js). */
export function filterHomeTabProducts(list: StoreProduct[], tab: "featured" | "trending" | "newarrival"): StoreProduct[] {
  if (tab === "featured") return filterProducts(list, { category: "silk" });
  if (tab === "trending") return filterProducts(list, { category: "cotton" });
  return list.filter((p) => {
    const key = productCategoryKey(p.category);
    return key === "party" || key === "kanjivaram";
  });
}

export function productPricing(product: StoreProduct) {
  const sale = parseMoneyAmount(product.price);
  const mrp = parseMoneyAmount(product.mrp);
  const showMrp = shouldShowMrpStrike(product.price, product.mrp);
  const badge = badgeDiscountPercent(product.discountPercentage, product.mrp, product.price);
  return { sale, mrp, showMrp, badge };
}

export function sortProducts(list: StoreProduct[], sort: string): StoreProduct[] {
  const copy = [...list];
  switch (sort) {
    case "price-low":
      return copy.sort((a, b) => (parseMoneyAmount(a.price) ?? 0) - (parseMoneyAmount(b.price) ?? 0));
    case "price-high":
      return copy.sort((a, b) => (parseMoneyAmount(b.price) ?? 0) - (parseMoneyAmount(a.price) ?? 0));
    case "name":
      return copy.sort((a, b) => String(a.title ?? "").localeCompare(String(b.title ?? "")));
    default:
      return copy;
  }
}

export function filterProducts(
  list: StoreProduct[],
  opts: { category?: string; min?: number; max?: number; search?: string }
): StoreProduct[] {
  return list.filter((p) => {
    if (opts.category && opts.category !== "all") {
      if (productCategoryKey(p.category) !== opts.category) return false;
    }
    const price = parseMoneyAmount(p.price) ?? 0;
    if (opts.min != null && price < opts.min) return false;
    if (opts.max != null && price > opts.max) return false;
    if (opts.search) {
      const q = opts.search.toLowerCase();
      const hay = `${p.title ?? ""} ${p.category ?? ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}
