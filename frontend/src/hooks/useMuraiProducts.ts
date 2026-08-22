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

function categoryBucket(category = "", title = ""): "silk" | "cotton" | "designer" | "other" {
  const text = `${category} ${title}`.toLowerCase();
  if (text.includes("cotton")) return "cotton";
  if (text.includes("silk") || text.includes("banarasi") || text.includes("kanjivaram") || text.includes("kanchipuram")) {
    return "silk";
  }
  if (text.includes("designer") || text.includes("party") || text.includes("georgette") || text.includes("chiffon")) {
    return "designer";
  }
  return "other";
}

export function useMuraiProducts() {
  const [products, setProducts] = useState<MuraiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get("/api/products");
        if (cancelled) return;
        if (data?.success === false) {
          setError(data?.message || "Failed to load products");
          setProducts([]);
        } else {
          setProducts(Array.isArray(data?.body) ? data.body : []);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load products");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const silk: MuraiProduct[] = [];
    const cotton: MuraiProduct[] = [];
    const designer: MuraiProduct[] = [];
    const other: MuraiProduct[] = [];

    for (const p of products) {
      const bucket = categoryBucket(p.category, p.title);
      if (bucket === "silk") silk.push(p);
      else if (bucket === "cotton") cotton.push(p);
      else if (bucket === "designer") designer.push(p);
      else other.push(p);
    }

    const fill = (arr: MuraiProduct[]) => (arr.length ? arr : products).slice(0, 8);
    return {
      silk: fill(silk),
      cotton: fill(cotton),
      designer: fill(designer.length ? designer : other),
      bestseller: products.slice(0, 4),
      deal: products.find((p) => Number(p.discountPercentage) > 0) ?? products[0] ?? null,
    };
  }, [products]);

  return { products, loading, error, grouped };
}
