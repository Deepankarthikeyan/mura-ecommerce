"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export type MuraiProduct = {
  _id?: string;
  productId?: string;
  slug?: string;
  title?: string;
  category?: string;
  price?: string | number;
  mrp?: string | number;
  discountPercentage?: string | number;
  image?: string;
  bannerImg?: string | string[];
  productAdMediaUrl?: string;
  quantity?: string | number;
};

export type MuraiCategoryTab = {
  id: string;
  label: string;
  products: MuraiProduct[];
};

const STATIC_TABS = [
  { id: "tab-featured", label: "Silk Sarees", keywords: ["silk", "banarasi", "kanjivaram", "paithani"] },
  { id: "tab-trending", label: "Cotton Sarees", keywords: ["cotton"] },
  { id: "tab-newarrival", label: "Designer Sarees", keywords: ["designer", "party", "bridal", "wedding"] },
] as const;

function matchesTab(product: MuraiProduct, keywords: readonly string[]) {
  const haystack = `${product.category ?? ""} ${product.title ?? ""}`.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword));
}

function distributeProducts(products: MuraiProduct[]): MuraiCategoryTab[] {
  const buckets: MuraiProduct[][] = [[], [], []];
  const used = new Set<string>();

  for (const product of products) {
    const key = String(product._id ?? product.productId ?? product.slug ?? product.title ?? "");
    if (used.has(key)) continue;

    const tabIndex = STATIC_TABS.findIndex((tab) => matchesTab(product, tab.keywords));
    const target = tabIndex >= 0 ? tabIndex : buckets.findIndex((bucket) => bucket.length === Math.min(...buckets.map((b) => b.length)));
    buckets[target >= 0 ? target : 0].push(product);
    used.add(key);
  }

  return STATIC_TABS.map((tab, index) => ({
    id: tab.id,
    label: tab.label,
    products: buckets[index].slice(0, 8),
  }));
}

export function useMuraiProducts() {
  const [products, setProducts] = useState<MuraiProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/products?categories=true"),
        ]);

        if (cancelled) return;

        if (productsRes.data?.success === false) {
          setError(productsRes.data?.message || "Failed to load products");
          setProducts([]);
        } else {
          setProducts(Array.isArray(productsRes.data?.body) ? productsRes.data.body : []);
        }

        const catList = categoriesRes.data?.body;
        setCategories(Array.isArray(catList) ? catList.map(String) : []);
      } catch {
        if (!cancelled) {
          setError("Failed to load products");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categoryTabs = useMemo((): MuraiCategoryTab[] => {
    if (!products.length) {
      return STATIC_TABS.map((tab) => ({ id: tab.id, label: tab.label, products: [] }));
    }
    return distributeProducts(products);
  }, [products]);

  const grouped = useMemo(() => {
    const byCategory: Record<string, MuraiProduct[]> = {};
    for (const p of products) {
      const cat = String(p.category || "Other");
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(p);
    }

    return {
      categoryTabs,
      byCategory,
      bestseller: products.slice(0, 4),
      deal: products.find((p) => Number(p.discountPercentage) > 0) ?? products[0] ?? null,
    };
  }, [products, categoryTabs]);

  return { products, categories, loading, error, grouped };
}
