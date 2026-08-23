import { findMuraiProductBySlug } from "./findMuraiProductBySlug";
import type { StoreProduct } from "./types";

/** Server-only product lookup: demo catalog first, then MongoDB when available. */
export async function resolveMuraiProductBySlug(slug: string): Promise<StoreProduct | null> {
  const demo = findMuraiProductBySlug(slug);
  if (demo) return demo;

  try {
    const { getStoreProductByLookup } = await import("@/functions/mongodbOperations");
    const doc = await getStoreProductByLookup(slug);
    return doc ? (doc as StoreProduct) : null;
  } catch {
    return null;
  }
}
