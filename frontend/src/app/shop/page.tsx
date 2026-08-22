"use client";

import HeaderOne from "@/components/header/Header";
import FooterOne from "@/components/Footer";
import MuraiBreadcrumb from "@/components/murai/MuraiBreadcrumb";
import MuraiPageAttrs from "@/components/murai/MuraiPageAttrs";
import MuraiFeaturesBar from "@/components/murai/MuraiFeaturesBar";
import MuraiProductCard from "@/components/murai/MuraiProductCard";
import MuraiShopSidebar from "@/components/murai/MuraiShopSidebar";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { shopProductPathSegment } from "@/lib/productSlug";
import { parseMoneyAmount, resolveProductListingImage } from "@/lib/shopProductDisplay";

function buildProductsQuery(search: string, category: string): string {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/api/products?${query}` : "/api/products";
}

const ProductSkeleton = () => (
  <div className="suruchi-product" style={{ minHeight: 360, background: "#f3ece8", borderRadius: 8 }} />
);

function ShopContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") ?? "";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch.trim());
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceMinFilter, setPriceMinFilter] = useState<number | null>(null);
  const [priceMaxFilter, setPriceMaxFilter] = useState<number | null>(null);

  useEffect(() => setSearchQuery(urlSearch), [urlSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;
    const loadCategories = async () => {
      try {
        const { data } = await axios.get("/api/products?categories=true");
        if (!cancelled && data?.success !== false) {
          const list = data?.body;
          setCategories(Array.isArray(list) ? list.map(String) : []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setIsLoading(true);
      setFetchError("");
      try {
        const { data } = await axios.get(buildProductsQuery(debouncedSearch, selectedCategory));
        if (cancelled) return;
        if (data?.success === false) {
          setFetchError(data?.message || "Failed to fetch products.");
          setProducts([]);
          return;
        }
        setProducts(Array.isArray(data?.body) ? data.body : []);
      } catch (error: any) {
        if (!cancelled) {
          setFetchError(error?.response?.data?.message || "Failed to fetch products.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedCategory]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (priceMinFilter != null) {
      list = list.filter((p) => (parseMoneyAmount(p.price) ?? 0) >= priceMinFilter);
    }
    if (priceMaxFilter != null) {
      list = list.filter((p) => (parseMoneyAmount(p.price) ?? 0) <= priceMaxFilter);
    }
    list.sort((a, b) => {
      const priceA = parseMoneyAmount(a.price) ?? 0;
      const priceB = parseMoneyAmount(b.price) ?? 0;
      const nameA = String(a.title ?? "");
      const nameB = String(b.title ?? "");
      switch (sortBy) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "name":
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });
    return list;
  }, [products, priceMinFilter, priceMaxFilter, sortBy]);

  const topProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => (parseMoneyAmount(b.price) ?? 0) - (parseMoneyAmount(a.price) ?? 0))
        .slice(0, 3)
        .map((p) => ({ title: p.title, price: p.price, mrp: p.mrp })),
    [products]
  );

  return (
    <>
      <MuraiBreadcrumb
        title="Shop"
        bannerImage="/assets/images/murai/banners/banner-shop.jpg"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop" },
        ]}
      />

      <div className="container shop-layout">
        <MuraiShopSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onPriceFilter={() => {
            setPriceMinFilter(minPrice ? Number(minPrice) : null);
            setPriceMaxFilter(maxPrice ? Number(maxPrice) : null);
          }}
          topProducts={topProducts}
        />

        <div className="shop-main">
          <div className="shop-toolbar">
            <p className="shop-results">
              {isLoading
                ? "Loading products..."
                : `Showing ${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"}`}
            </p>
            <div className="shop-sort">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products">
                <option value="latest">Sort by latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Sort by name</option>
              </select>
            </div>
          </div>

          <div className="shop-products suruchi-products-grid">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : fetchError ? (
              <p style={{ gridColumn: "1 / -1", color: "#cf0653" }}>{fetchError}</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((post, index) => (
                <MuraiProductCard
                  key={String(post?._id ?? post?.productId ?? post?.slug ?? index)}
                  slug={shopProductPathSegment(post)}
                  title={post.title}
                  category={post.category}
                  image={resolveProductListingImage(post)}
                  price={post.price}
                  mrp={post.mrp}
                  discountPercentage={post.discountPercentage}
                />
              ))
            ) : (
              <p style={{ gridColumn: "1 / -1" }}>No products match your filters.</p>
            )}
          </div>
        </div>
      </div>

      <MuraiFeaturesBar />
    </>
  );
}

export default function ShopPage() {
  return (
    <div className="murai-home">
      <MuraiPageAttrs page="shop" />
      <HeaderOne />
      <main>
        <Suspense fallback={<div className="container section">Loading shop...</div>}>
          <ShopContent />
        </Suspense>
      </main>
      <FooterOne />
    </div>
  );
}
