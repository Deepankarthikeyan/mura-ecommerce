"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const tabsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    const element = tabsRef.current;
    if (!element) return;

    let cancelled = false;
    const updateArrows = () => {
      if (cancelled) return;
      setCanScrollLeft(element.scrollLeft > 1);
      setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 1);
    };
    const observer = new ResizeObserver(updateArrows);
    observer.observe(element);
    element.addEventListener("scroll", updateArrows, { passive: true });
    updateArrows();
    document.fonts.ready.then(updateArrows);

    return () => {
      cancelled = true;
      observer.disconnect();
      element.removeEventListener("scroll", updateArrows);
    };
  }, [tabs]);

  const scrollTabs = (direction: number) => {
    const element = tabsRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.75,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

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
            <div className="sale-sarees-tabs-wrap">
              <button className="sale-sarees-tabs-arrow" type="button" aria-label="Scroll categories left" disabled={!canScrollLeft} onClick={() => scrollTabs(-1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <div ref={tabsRef} className="sale-sarees-tabs" role="tablist" aria-label="Saree categories">
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
              <button className="sale-sarees-tabs-arrow" type="button" aria-label="Scroll categories right" disabled={!canScrollRight} onClick={() => scrollTabs(1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
              </button>
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
