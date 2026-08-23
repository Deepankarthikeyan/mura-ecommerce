import { shopProductPathSegment } from "@/lib/productSlug";
import { DEMO_SAREE_PRODUCTS } from "./demoProducts";
import type { StoreProduct } from "./types";

export function findMuraiProductBySlug(slug: string): StoreProduct | null {
  const norm = slug.trim().toLowerCase();
  if (!norm) return null;

  return (
    DEMO_SAREE_PRODUCTS.find((p) => {
      const segment = shopProductPathSegment(p).toLowerCase();
      return (
        segment === norm ||
        String(p.urlSlug ?? "").toLowerCase() === norm ||
        String(p.slug ?? "").toLowerCase() === norm ||
        String(p.productId ?? "").toLowerCase() === norm ||
        String(p._id ?? "").toLowerCase() === norm
      );
    }) ?? null
  );
}
