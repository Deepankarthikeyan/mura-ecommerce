"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import MuraiLayout from "./MuraiLayout";
import MuraiFeaturesBar from "./MuraiFeaturesBar";
import MuraiProductCard from "./MuraiProductCard";
import { filterProducts, formatInr, sortProducts } from "@/lib/murai/productUtils";
import { useProducts } from "@/lib/murai/useProducts";
import { useCategories } from "@/lib/storefront/useCategories";

function ShopContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const urlCategory = searchParams.get("category") ?? "all";
  const { products, loading } = useProducts();
  const { categories } = useCategories();

  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState("latest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    const list = filterProducts(products, {
      category,
      search: urlSearch,
      min: minPrice ? Number(minPrice) : undefined,
      max: maxPrice ? Number(maxPrice) : undefined,
    });
    return sortProducts(list, sort);
  }, [products, category, urlSearch, minPrice, maxPrice, sort]);

  const topRated = useMemo(() => {
    return [...products]
      .sort((a, b) => (Number(b.ratings) || 0) - (Number(a.ratings) || 0))
      .slice(0, 3);
  }, [products]);

  const applyPriceFilter = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <section className="breadcrumb__section">
        <div className="breadcrumb__bg">
          <img className="breadcrumb__bg-image" src="/murai/images/banners/banner-shop.jpg" alt="" width={1600} height={334} />
          <div className="container">
            <div className="breadcrumb__content">
              <h1 className="breadcrumb__content--title">Shop</h1>
              <ul className="breadcrumb__content--menu">
                <li className="breadcrumb__content--menu__items"><Link href="/">Home</Link></li>
                <li className="breadcrumb__content--menu__items"><span>Shop</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="container shop-layout">
        <button className="shop-filter-toggle" type="button" aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h10M4 18h16" />
          </svg>
          Filters &amp; Categories
        </button>

        <aside className={`shop-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="shop-sidebar-header">
            <h3 className="shop-sidebar-title">Filters</h3>
            <button className="shop-sidebar-close" type="button" aria-label="Close filters" onClick={() => setSidebarOpen(false)}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="shop-sidebar-body">
            <h3 className="sidebar-title">Saree Types</h3>
            <ul className="sidebar-list">
              {categories.map((cat) => (
                <li key={cat.key}>
                  <a
                    href="#"
                    className={category === cat.key ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setCategory(cat.key);
                    }}
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="sidebar-title" style={{ marginTop: 32 }}>Filter By Price</h3>
            <div className="price-filter">
              <input type="number" placeholder="Min ₹" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <span>—</span>
              <input type="number" placeholder="Max ₹" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm price-filter-btn" type="button" style={{ width: "100%" }} onClick={applyPriceFilter}>
              Filter
            </button>

            <h3 className="sidebar-title" style={{ marginTop: 32 }}>Top Rated</h3>
            {topRated.map((p) => (
              <div key={p._id ?? p.productId} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: "var(--suruchi-primary, #cf0653)" }}>
                  {formatInr(p.price)}{" "}
                  {p.mrp ? (
                    <span style={{ textDecoration: "line-through", color: "var(--suruchi-gray-light, #979797)" }}>
                      {formatInr(p.mrp)}
                    </span>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </aside>

        <div className="shop-main">
          <div className="shop-toolbar">
            <p className="shop-results">Showing {filtered.length} saree{filtered.length !== 1 ? "s" : ""} on sale</p>
            <div className="shop-sort">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">Sort by latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Sort by name</option>
              </select>
            </div>
          </div>
          <div className="shop-products suruchi-products-grid" data-render="sarees">
            {loading ? (
              <p>Loading products...</p>
            ) : filtered.length ? (
              filtered.map((p) => <MuraiProductCard key={p._id ?? p.productId} product={p} style="shop" />)
            ) : (
              <p>No sarees match your filters.</p>
            )}
          </div>
        </div>
      </div>

      <MuraiFeaturesBar />
    </>
  );
}

export default function MuraiShopPage() {
  return (
    <MuraiLayout activePage="shop">
      <Suspense fallback={<p style={{ padding: 40 }}>Loading shop...</p>}>
        <ShopContent />
      </Suspense>
    </MuraiLayout>
  );
}
