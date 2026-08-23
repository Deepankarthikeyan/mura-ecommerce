"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { shopProductPathSegment } from "@/lib/productSlug";
import { DEMO_SAREE_PRODUCTS } from "./demoProducts";
import type { StoreProduct } from "./types";

export function useProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/products");
        const list = Array.isArray(data?.body) ? data.body : [];
        if (!cancelled) {
          if (list.length > 0) {
            setProducts(list);
            setUsingDemo(false);
          } else {
            setProducts(DEMO_SAREE_PRODUCTS);
            setUsingDemo(true);
          }
        }
      } catch {
        if (!cancelled) {
          setProducts(DEMO_SAREE_PRODUCTS);
          setUsingDemo(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { products, loading, usingDemo };
}

export async function fetchProductBySlug(slug: string): Promise<StoreProduct | null> {
  try {
    const { data } = await axios.get("/api/products", { params: { lookup: slug } });
    if (data?.body) return data.body as StoreProduct;
  } catch {
    /* fall through */
  }
  const demo = DEMO_SAREE_PRODUCTS.find(
    (p) =>
      p.urlSlug === slug ||
      p.slug === slug ||
      p.productId === slug ||
      shopProductPathSegment(p) === slug
  );
  return demo ?? null;
}
