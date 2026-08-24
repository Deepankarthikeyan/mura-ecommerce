"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { normalizeMuraiProducts } from "./productUtils";
import type { StoreProduct } from "./types";

export function useProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("/api/products");
        const list = Array.isArray(data?.body) ? data.body : [];
        if (!cancelled) {
          setProducts(normalizeMuraiProducts(list));
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
          setError("Unable to load products");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}

export async function fetchProductBySlug(slug: string): Promise<StoreProduct | null> {
  try {
    const { data } = await axios.get("/api/products", { params: { lookup: slug } });
    if (data?.body) return data.body as StoreProduct;
  } catch {
    /* fall through */
  }

  return null;
}
