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
    if (!products.length) return [];

    const tabs: MuraiCategoryTab[] = [];
    const used = new Set<string>();

    for (const cat of categories) {
      const matched = products.filter((p) => String(p.category ?? "") === cat);
      if (matched.length > 0) {
        tabs.push({
          id: cat.toLowerCase().replace(/\s+/g, "-"),
          label: cat,
          products: matched.slice(0, 8),
        });
        used.add(cat);
      }
    }

    // Products without a listed category
    const uncategorized = products.filter((p) => !p.category || !used.has(String(p.category)));
    if (uncategorized.length > 0 && tabs.length < 3) {
      tabs.push({
        id: "all-products",
        label: "All Products",
        products: uncategorized.slice(0, 8),
      });
    }

    // Fallback: split products into 3 tabs if no categories
    if (tabs.length === 0) {
      const chunk = Math.ceil(products.length / 3) || 1;
      return [
        { id: "tab-1", label: "Featured", products: products.slice(0, chunk) },
        { id: "tab-2", label: "Popular", products: products.slice(chunk, chunk * 2) },
        { id: "tab-3", label: "New Arrivals", products: products.slice(chunk * 2, chunk * 3) },
      ];
    }

    return tabs.slice(0, 3);
  }, [products, categories]);

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
