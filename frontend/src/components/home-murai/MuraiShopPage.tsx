"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import "./murai.css";
import MuraiHeader from "./MuraiHeader";
import MuraiShopBenefits from "./MuraiShopBenefits";
import MuraiShopFooter from "./MuraiShopFooter";
import { MuraiProductCard } from "./MuraiProductCard";
import { formatInr, type MuraiSaree } from "./murai-data";
import { mapApiProducts } from "./muraiProducts";
import {
  getSareeCategoryByKey,
  productMatchesSareeCategory,
  SAREE_CATEGORIES,
} from "@/lib/storefront/sareeCategories";

const ALL_CATEGORY = "all";

const CATEGORY_KEYWORDS: Record<string, string> = {
  "All Sarees": ALL_CATEGORY,
  "Silk Sarees": "silk",
  "Cotton Sarees": "cotton",
  Banarasi: "silk",
  Kanjivaram: "kanjivaram",
  "Party Wear": "party",
};

type SortKey = "latest" | "price-asc" | "price-desc" | "name";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "latest", label: "Sort by latest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Sort by name" },
];

function selectedCategoryFromQuery(value: string | null) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed || CATEGORY_KEYWORDS[trimmed] === ALL_CATEGORY) return ALL_CATEGORY;
  return trimmed;
}

function productMatchesCategory(productCategory: string, selected: string) {
  if (selected === ALL_CATEGORY) return true;
  const hay = productCategory.toLowerCase();
  const selectedLower = selected.toLowerCase();
  if (hay === selectedLower) return true;
  if (getSareeCategoryByKey(selectedLower)) {
    return productMatchesSareeCategory(productCategory, selectedLower);
  }
  const mapped = CATEGORY_KEYWORDS[selected];
  if (mapped && mapped !== ALL_CATEGORY) {
    return hay.includes(mapped);
  }
  return hay.includes(selectedLower) || selectedLower.includes(hay);
}

function MuraiShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const category = selectedCategoryFromQuery(searchParams.get("category"));
  const [catalog, setCatalog] = useState<MuraiSaree[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMin, setAppliedMin] = useState<number | null>(null);
  const [appliedMax, setAppliedMax] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>("latest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (!filterOpen && !sortOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
        setSortOpen(false);
      }
    };
    const onResize = () => {
      if (window.innerWidth > 991) {
        setFilterOpen(false);
        setSortOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [filterOpen, sortOpen]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const query = params.toString();
        const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
          axios.get(query ? `/api/products?${query}` : "/api/products"),
          axios.get("/api/products?categories=true"),
        ]);
        if (cancelled) return;

        const rawProducts = productsData?.body;
        if (productsData?.success === false || !Array.isArray(rawProducts)) {
          setCatalog([]);
          setError(String(productsData?.message || "Failed to load products."));
        } else {
          setCatalog(mapApiProducts(rawProducts));
        }

        const rawCategories = categoriesData?.body;
        setCategories(Array.isArray(rawCategories) ? rawCategories.map(String).filter(Boolean) : []);
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? String(err.response.data.message)
            : "Failed to load products.";
        setError(message);
        setCatalog([]);
        setCategories([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [search]);

  const setCategory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === ALL_CATEGORY) params.delete("category");
    else params.set("category", id);
    const query = params.toString();
    router.replace(query ? `/shop?${query}` : "/shop", { scroll: false });
  };

  const applyPrice = (event: FormEvent) => {
    event.preventDefault();
    const min = Number(minPrice);
    const max = Number(maxPrice);
    setAppliedMin(minPrice.trim() && !Number.isNaN(min) ? min : null);
    setAppliedMax(maxPrice.trim() && !Number.isNaN(max) ? max : null);
    setFilterOpen(false);
  };

  const closePanels = () => {
    setFilterOpen(false);
    setSortOpen(false);
  };

  const openFilters = () => {
    setSortOpen(false);
    setFilterOpen(true);
  };

  const openSort = () => {
    setFilterOpen(false);
    setSortOpen(true);
  };

  const chooseSort = (value: SortKey) => {
    setSort(value);
    setSortOpen(false);
  };

  const products = useMemo(() => {
    let list = catalog.filter((item) => {
      if (!productMatchesCategory(item.category, category)) return false;
      if (appliedMin != null && item.price < appliedMin) return false;
      if (appliedMax != null && item.price > appliedMax) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [appliedMax, appliedMin, catalog, category, sort]);

  const sidebarCategories = useMemo(() => {
    const sareeTypes = SAREE_CATEGORIES.map((cat) => ({ id: cat.key, label: cat.label }));
    const apiExtras = categories
      .filter((name) => !SAREE_CATEGORIES.some((cat) => cat.label.toLowerCase() === name.toLowerCase()))
      .map((name) => ({ id: name, label: name }));
    return [{ id: ALL_CATEGORY, label: "All Sarees" }, ...sareeTypes, ...apiExtras];
  }, [categories]);
  const topRated = useMemo(
    () =>
      [...catalog]
        .sort((a, b) => (b.ratings ?? 0) - (a.ratings ?? 0) || a.name.localeCompare(b.name))
        .slice(0, 3),
    [catalog]
  );

  return (
    <main className="shop-page-main">
      <section className="shop-hero">
        <img src="/murai/banners/banner-shop.jpg" alt="Only one, only yours — exclusive silk sarees" className="shop-hero-img" />
        <div className="shop-hero-inner">
          <div className="shop-hero-crumb">
            <h1>Shop</h1>
            <nav aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true"> / </span>
              <span>Shop</span>
            </nav>
          </div>
        </div>
      </section>

      <div className="shop-page-inner">
        <div className="shop-layout">
          <div
            className={`shop-sidebar-overlay${filterOpen || sortOpen ? " open" : ""}`}
            onClick={closePanels}
            aria-hidden="true"
          />

          <aside className={`shop-sidebar${filterOpen ? " open" : ""}`}>
            <div className="shop-sidebar-header">
              <h3 className="shop-sidebar-title">Filters</h3>
              <button type="button" className="shop-sidebar-close" aria-label="Close filters" onClick={closePanels}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="shop-sidebar-body">
              <h3 className="sidebar-title">Saree Types</h3>
              <ul className="sidebar-list">
                {sidebarCategories.map((type) => {
                  const isActive =
                    category === ALL_CATEGORY
                      ? type.id === ALL_CATEGORY
                      : type.id.toLowerCase() === category.toLowerCase();
                  return (
                    <li key={type.id}>
                      <button
                        type="button"
                        className={isActive ? "active" : ""}
                        onClick={() => setCategory(type.id)}
                      >
                        {type.label}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <h3 className="sidebar-title">Filter By Price</h3>
              <form className="price-filter-form" onSubmit={applyPrice}>
                <div className="price-filter">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    aria-label="Minimum price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span>—</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    aria-label="Maximum price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <button type="submit" className="price-filter-btn">
                  Filter
                </button>
              </form>

              <h3 className="sidebar-title">Top Rated</h3>
              <ul className="top-rated-list">
                {topRated.map((item) => (
                  <li key={item.id}>
                    <Link href={item.href || "/shop"} className="top-rated-item">
                      <img src={item.img} alt="" width={56} height={56} />
                      <span>
                        <strong>{item.name}</strong>
                        <span className="top-rated-price">
                          <span className="current">{formatInr(item.price)}</span>
                          {item.old > item.price ? <span className="old">{formatInr(item.old)}</span> : null}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="shop-main" id="shop-grid">
            <div className="shop-toolbar">
              <p className="shop-results">
                {isLoading
                  ? "Loading products…"
                  : `Showing ${products.length} saree${products.length === 1 ? "" : "s"}`}
              </p>
              <div className="shop-sort">
                <label htmlFor="shop-sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="shop-sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <p className="shop-empty">Loading products…</p>
            ) : error ? (
              <p className="shop-empty">{error}</p>
            ) : products.length ? (
              <div className="shop-products">
                {products.map((product) => (
                  <MuraiProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="shop-empty">No products available.</p>
            )}
          </div>
        </div>
      </div>

      <div
        id="shop-sort-sheet"
        className={`shop-sort-sheet${sortOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-sort-sheet-title"
        aria-hidden={!sortOpen}
      >
        <div className="shop-sort-sheet-handle" aria-hidden="true" />
        <div className="shop-sort-sheet-header">
          <h3 id="shop-sort-sheet-title">Sort by</h3>
          <button type="button" className="shop-sidebar-close" aria-label="Close sort" onClick={closePanels}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ul className="shop-sort-sheet-list">
          {SORT_OPTIONS.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={sort === option.value ? "active" : ""}
                onClick={() => chooseSort(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="shop-mobile-bar" role="toolbar" aria-label="Sort and filter">
        <button
          type="button"
          className={sortOpen ? "is-active" : ""}
          aria-expanded={sortOpen}
          aria-controls="shop-sort-sheet"
          onClick={sortOpen ? closePanels : openSort}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h10M4 12h6M4 17h3" />
            <path d="M16 5v14M16 5l3.5 3.5M16 19l3.5-3.5" />
          </svg>
          Sort
        </button>
        <button
          type="button"
          className={filterOpen ? "is-active" : ""}
          aria-expanded={filterOpen}
          onClick={filterOpen ? closePanels : openFilters}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          Filter
        </button>
      </div>
    </main>
  );
}

export default function MuraiShopPage() {
  return (
    <div className="murai-home" data-page="shop">
      <MuraiHeader />
      <Suspense
        fallback={
          <main className="shop-page-main">
            <div className="shop-hero shop-hero--fallback">
              <h1>Shop</h1>
            </div>
          </main>
        }
      >
        <MuraiShopContent />
      </Suspense>
      <MuraiShopBenefits />
      <MuraiShopFooter />
    </div>
  );
}
