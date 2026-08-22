"use client";

import { useEffect, useState } from "react";

type MuraiShopSidebarProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onPriceFilter: () => void;
  topProducts?: Array<{ title: string; price?: string | number; mrp?: string | number }>;
};

export default function MuraiShopSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceFilter,
  topProducts = [],
}: MuraiShopSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("shop-sidebar-open", sidebarOpen);
    return () => document.body.classList.remove("shop-sidebar-open");
  }, [sidebarOpen]);

  return (
    <>
      <button
        className="shop-filter-toggle"
        type="button"
        aria-expanded={sidebarOpen}
        aria-label="Open filters"
        onClick={() => setSidebarOpen(true)}
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16M4 12h10M4 18h16" />
        </svg>
        Filters &amp; Categories
      </button>

      <div
        className={`shop-sidebar-overlay${sidebarOpen ? " open" : ""}`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`shop-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="shop-sidebar-header">
          <h3 className="shop-sidebar-title">Filters</h3>
          <button
            className="shop-sidebar-close"
            type="button"
            aria-label="Close filters"
            onClick={() => setSidebarOpen(false)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="shop-sidebar-body">
          <h3 className="sidebar-title">Categories</h3>
          <ul className="sidebar-list">
            <li>
              <button
                type="button"
                className={selectedCategory === "" ? "active" : ""}
                onClick={() => onCategoryChange("")}
                style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
              >
                All Products
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  type="button"
                  className={selectedCategory === category ? "active" : ""}
                  onClick={() => onCategoryChange(category)}
                  style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>

          <h3 className="sidebar-title" style={{ marginTop: 32 }}>
            Filter By Price
          </h3>
          <div className="price-filter">
            <input
              type="number"
              placeholder="Min ₹"
              min={0}
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
            />
            <span>—</span>
            <input
              type="number"
              placeholder="Max ₹"
              min={0}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-sm price-filter-btn" style={{ width: "100%" }} type="button" onClick={onPriceFilter}>
            Filter
          </button>

          {topProducts.length > 0 ? (
            <>
              <h3 className="sidebar-title" style={{ marginTop: 32 }}>
                Top Rated
              </h3>
              {topProducts.slice(0, 3).map((product) => (
                <div key={product.title} style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{product.title}</p>
                  <p style={{ fontSize: 13, color: "var(--color-primary)" }}>
                    {product.price ? `₹${product.price}` : ""}
                    {product.mrp ? (
                      <span style={{ textDecoration: "line-through", color: "var(--color-text-muted)", marginLeft: 6 }}>
                        ₹{product.mrp}
                      </span>
                    ) : null}
                  </p>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </aside>
    </>
  );
}
