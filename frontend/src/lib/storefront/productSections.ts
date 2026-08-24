import type { StoreProduct } from "@/lib/murai/types";
import { filterHomeTabProducts, productCategoryKey } from "@/lib/murai/productUtils";
import type { HomeTab } from "./types";

function hasTag(product: StoreProduct, tag: string): boolean {
  const needle = tag.trim().toLowerCase();
  if (!needle) return false;
  const tags = Array.isArray(product.tags) ? product.tags : [];
  return tags.some((t) => String(t).trim().toLowerCase() === needle);
}

export function pickDealProduct(products: StoreProduct[], tag = "deal-of-day"): StoreProduct | undefined {
  const tagged = products.find((p) => hasTag(p, tag));
  return tagged ?? products[0];
}

export function pickBestSellers(products: StoreProduct[], tag = "bestseller", limit = 4): StoreProduct[] {
  const tagged = products.filter((p) => hasTag(p, tag));
  if (tagged.length >= limit) return tagged.slice(0, limit);
  if (tagged.length > 0) return tagged;
  return products.slice(0, limit);
}

export function filterHomeTabByConfig(
  products: StoreProduct[],
  tab: HomeTab
): StoreProduct[] {
  const filter = tab.filter.trim().toLowerCase();
  if (!filter || filter === "all") return products;

  if (filter === "silk" || filter === "cotton" || filter === "kanjivaram" || filter === "party") {
    return filterHomeTabProducts(
      products,
      filter === "silk" ? "featured" : filter === "cotton" ? "trending" : "newarrival"
    );
  }

  if (filter === "designer") {
    return filterHomeTabProducts(products, "newarrival");
  }

  return products.filter((p) => {
    const cat = String(p.category ?? "").toLowerCase();
    return cat === filter || cat.includes(filter);
  });
}

export function categoryKeyFromName(name: string): string {
  return productCategoryKey(name);
}
