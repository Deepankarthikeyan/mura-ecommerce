"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MuraiProductCard } from "./MuraiProductCard";
import { mapApiProducts } from "./muraiProducts";
import type { MuraiSaree } from "./murai-data";

const ALL_TAB = "all";

export default function MuraiSaleSarees() {
  const [products, setProducts] = useState<MuraiSaree[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [active, setActive] = useState(ALL_TAB);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/products?categories=true"),
        ]);
        if (cancelled) return;

        if (productsData?.success === false) {
          setProducts([]);
          setError(String(productsData?.message || "Failed to load products."));
        } else {
          setProducts(mapApiProducts(productsData?.body));
        }

        const list = Array.isArray(categoriesData?.body)
          ? categoriesData.body.map(String).filter(Boolean)
          : [];
        setCategories(list);
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "Failed to load products.";
        setError(message);
        setProducts([]);
        setCategories([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const tabs = useMemo(
    () => [{ id: ALL_TAB, label: "All Sarees" }, ...categories.map((name) => ({ id: name, label: name }))],
    [categories]
  );

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === active)) {
      setActive(ALL_TAB);
    }
  }, [active, tabs]);

  const visibleProducts =
    active === ALL_TAB
      ? products
      : products.filter((item) => item.category.toLowerCase() === active.toLowerCase());

  return (
    <section className="products-section">
      <div className="products-section-inner">
        <header className="sale-sarees-head">
          <h2>Sale Sarees</h2>
          {tabs.length > 1 ? (
            <div className="sale-sarees-tabs" role="tablist" aria-label="Saree categories">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={active === tab.id ? "is-active" : undefined}
                  type="button"
                  role="tab"
                  aria-selected={active === tab.id}
                  onClick={() => setActive(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : null}
        </header>

        {isLoading ? (
          <p className="shop-empty">Loading products…</p>
        ) : error ? (
          <p className="shop-empty">{error}</p>
        ) : visibleProducts.length ? (
          <div className="tab-pane active">
            <div className="suruchi-products-grid">
              {visibleProducts.map((product) => (
                <MuraiProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <p className="shop-empty">No products available.</p>
        )}
      </div>
    </section>
  );
}
