import type { StoreProduct } from "./types";

/** Server-only product lookup from MongoDB. */
export async function resolveMuraiProductBySlug(slug: string): Promise<StoreProduct | null> {
  try {
    const { getStoreProductByLookup } = await import("@/functions/mongodbOperations");
    const doc = await getStoreProductByLookup(slug);
    return doc ? (doc as StoreProduct) : null;
  } catch {
    return null;
  }
}
