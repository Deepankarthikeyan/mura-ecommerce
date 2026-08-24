"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { productCategoryKey } from "@/lib/murai/productUtils";

const FALLBACK_CATEGORIES = [
  { key: "all", label: "All Sarees" },
  { key: "silk", label: "Silk Sarees" },
  { key: "cotton", label: "Cotton Sarees" },
  { key: "kanjivaram", label: "Kanjivaram" },
  { key: "party", label: "Party Wear" },
];

export type CategoryOption = { key: string; label: string };

function categoryOptionFromName(name: string): CategoryOption {
  const label = String(name).trim();
  const mapped = productCategoryKey(label);
  const key = mapped !== "all" ? mapped : label.toLowerCase().replace(/\s+/g, "-");
  return { key, label };
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryOption[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get("/api/products", { params: { categories: true } });
        const list = Array.isArray(data?.body) ? data.body : [];
        if (!cancelled && list.length > 0) {
          const dynamic = list.map((name: string) => categoryOptionFromName(name));
          setCategories([{ key: "all", label: "All Sarees" }, ...dynamic]);
        }
      } catch {
        if (!cancelled) setCategories(FALLBACK_CATEGORIES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading };
}
