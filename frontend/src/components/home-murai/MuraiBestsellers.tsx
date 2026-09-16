"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MuraiProductCard } from "./MuraiProductCard";
import { mapApiProducts } from "./muraiProducts";
import type { MuraiSaree } from "./murai-data";

const BESTSELLER_LIMIT = 4;

export default function MuraiBestsellers() {
  const [products, setProducts] = useState<MuraiSaree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await axios.get("/api/products");
        if (cancelled) return;
        if (data?.success === false) {
          setProducts([]);
          setError(String(data?.message || "Failed to load products."));
          return;
        }
        const list = mapApiProducts(data?.body)
          .sort((a, b) => (b.ratings ?? 0) - (a.ratings ?? 0) || a.name.localeCompare(b.name))
          .slice(0, BESTSELLER_LIMIT);
        setProducts(list);
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "Failed to load products.";
        setError(message);
        setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bestseller-section">
      <div className="section-heading">
        <h2>Best Selling Sarees</h2>
      </div>
      {isLoading ? (
        <p className="shop-empty">Loading products…</p>
      ) : error ? (
        <p className="shop-empty">{error}</p>
      ) : products.length ? (
        <div className="bestseller-grid">
          {products.map((product) => (
            <MuraiProductCard key={product.id} product={product} variant="bestseller" />
          ))}
        </div>
      ) : (
        <p className="shop-empty">No products available.</p>
      )}
    </section>
  );
}
