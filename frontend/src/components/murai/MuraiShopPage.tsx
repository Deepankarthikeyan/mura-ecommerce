"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import MuraiLayout from "./MuraiLayout";
import MuraiProductCard from "./MuraiProductCard";
import { filterProducts, sortProducts } from "@/lib/murai/productUtils";
import { useProducts } from "@/lib/murai/useProducts";

function ShopContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";
  const urlCategory = searchParams.get("category") ?? "all";
  const { products, loading } = useProducts();

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
        <button className="shop-filter-toggle" type="button" onClick={() => setSidebarOpen(true)}>
          Filters &amp; Categories
        </button>

        <aside className={`shop-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="shop-sidebar-header">
            <h3 className="shop-sidebar-title">Filters</h3>
            <button className="shop-sidebar-close" type="button" onClick={() => setSidebarOpen(false)}>×</button>
          </div>
          <div className="shop-sidebar-body">
            <h3 className="sidebar-title">Saree Types</h3>
            <ul className="sidebar-list">
              {[
                ["all", "All Sarees"],
                ["silk", "Silk Sarees"],
                ["cotton", "Cotton Sarees"],
                ["kanjivaram", "Kanjivaram"],
                ["party", "Party Wear"],
              ].map(([key, label]) => (
                <li key={key}>
                  <a
                    href="#"
                    className={category === key ? "active" : ""}
                    onClick={(e) => { e.preventDefault(); setCategory(key); }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="sidebar-title" style={{ marginTop: 32 }}>Filter By Price</h3>
            <div className="price-filter">
              <input type="number" placeholder="Min ₹" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <span>—</span>
              <input type="number" placeholder="Max ₹" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
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
          <div className="shop-products suruchi-products-grid">
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
