"use client";

import { useState, useEffect } from "react";
import WeeklyBestSellingMain from "@/components/product-main/WeeklyBestSellingMain";
import axios from "axios";
import { shopProductPathSegment } from "@/lib/productSlug";
import { resolveProductListingImage } from "@/lib/shopProductDisplay";

/** Liquid / syrup-style SKUs (tier 0). Excludes titles with "curnam" — those are powders (tier 2). */
function isLiquidSyrupTier(text: string): boolean {
  if (text.includes("curnam")) {
    return false;
  }
  if (text.includes("syrup")) {
    return true;
  }
  /* Flagship liquids often omit the word “syrup” in the title. */
  if (text.includes("biozen")) {
    return true;
  }
  if (text.includes("pulmozen")) {
    return true;
  }
  if (text.includes("hbzen")) {
    return true;
  }
  if (text.includes("tineer")) {
    return true;
  }
  if (text.includes("kudineer")) {
    return true;
  }
  return false;
}

/** Display order: liquid syrups & tonic lines (0), soaps (1), curnam powders (2), other (3). */
function productShelfGroup(product: { category?: string; title?: string }): number {
  const text = `${String(product.category ?? "")} ${String(product.title ?? "")}`.toLowerCase();
  if (isLiquidSyrupTier(text)) {
    return 0;
  }
  if (text.includes("soap")) {
    return 1;
  }
  if (text.includes("curnam")) {
    return 2;
  }
  return 3;
}

function sortProductsForShelf<T extends { category?: string; title?: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const ga = productShelfGroup(a);
    const gb = productShelfGroup(b);
    if (ga !== gb) {
      return ga - gb;
    }
    return String(a.title ?? "").localeCompare(String(b.title ?? ""), undefined, { sensitivity: "base" });
  });
}

const ProductSkeleton = () => (
  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
    <div className="single-shopping-card-one" style={{ padding: "20px" }}>
      <div
        style={{
          width: "100%",
          height: "200px",
          backgroundColor: "#e0e0e0",
          borderRadius: "8px",
          marginBottom: "15px",
          animation: "our-products-pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "80%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          marginBottom: "10px",
          animation: "our-products-pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "60%",
          height: "16px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          marginBottom: "15px",
          animation: "our-products-pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "40%",
          height: "20px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "our-products-pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  </div>
);

function buildProductsQuery(search: string, category: string): string {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }
  if (category) {
    params.set("category", category);
  }
  const query = params.toString();
  return query ? `/api/products?${query}` : "/api/products";
}

/** Home “Our Products” grid: all listing products from Mongo via `/api/products`. */
const WeeklyBestSelling: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let cancelled = false;

    const loadCategories = async () => {
      try {
        const { data } = await axios.get("/api/products?categories=true");
        if (cancelled || data?.success === false) {
          return;
        }
        const list = data?.body;
        setCategories(Array.isArray(list) ? list.map(String) : []);
      } catch (e) {
        console.error("API error while fetching product categories:", e);
      }
    };

    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const { data } = await axios.get(buildProductsQuery(debouncedSearch, selectedCategory));
        if (cancelled) return;
        if (data?.success === false) {
          setFetchError(typeof data?.message === "string" ? data.message : "Failed to load products.");
          setProducts([]);
          return;
        }
        const list = data?.body;
        const raw = Array.isArray(list) ? list : [];
        setProducts(sortProductsForShelf(raw));
      } catch (e) {
        console.error("API error while fetching products:", e);
        if (!cancelled) {
          setFetchError("Could not load products.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedCategory]);

  return (
    <section className="products-section">
      <div className="products-section-inner">
        <div className="section-heading"><h2>Sale Sarees</h2></div>
      <div className="popular-product-col-7-area rts-section-gapBottom">
        <div className="cover-card-main-over-white">
          <div className="row">
            <div className="col-lg-12">
              <div className="cover-card-main-over-1">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="title-area-between our-products-title-row">
                        <h2 className="title-left">Our Products</h2>
                        <div className="our-products-toolbar">
                          <div className="our-products-search">
                            <input
                              type="search"
                              className="our-products-search-input"
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              aria-label="Search products"
                            />
                            <i className="fa-light fa-magnifying-glass" aria-hidden="true" />
                          </div>
                          <select
                            className="our-products-category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            aria-label="Filter by category"
                          >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <style>{`
                        .our-products-title-row {
                          flex-direction: row !important;
                          flex-wrap: nowrap;
                          align-items: center;
                          gap: 16px;
                        }
                        .our-products-title-row .title-left {
                          flex-shrink: 0;
                          margin-bottom: 0;
                        }
                        .our-products-toolbar {
                          display: flex;
                          align-items: center;
                          gap: 12px;
                          flex-wrap: nowrap;
                          flex-shrink: 0;
                          margin-left: auto;
                        }
                        .our-products-search {
                          position: relative;
                          width: 220px;
                          flex: 0 0 auto;
                        }
                        .our-products-search-input {
                          width: 100%;
                          height: 42px;
                          border: 1px solid #e2e2e2;
                          border-radius: 6px;
                          padding: 0 40px 0 14px;
                          font-size: 14px;
                          color: #2c3c28;
                          background: #fff;
                          outline: none;
                        }
                        .our-products-search-input:focus {
                          border-color: var(--color-primary);
                        }
                        .our-products-search i {
                          position: absolute;
                          right: 14px;
                          top: 50%;
                          transform: translateY(-50%);
                          color: #2c3c28;
                          pointer-events: none;
                        }
                        .our-products-category-select {
                          width: 180px;
                          flex: 0 0 auto;
                          height: 42px;
                          border: 1px solid #e2e2e2;
                          border-radius: 6px;
                          padding: 0 36px 0 14px;
                          font-size: 14px;
                          color: #2c3c28;
                          background: #fff;
                          cursor: pointer;
                          outline: none;
                        }
                        .our-products-category-select:focus {
                          border-color: var(--color-primary);
                        }
                        @media (max-width: 767px) {
                          .our-products-search {
                            width: 160px;
                          }
                          .our-products-category-select {
                            width: 150px;
                          }
                        }
                      `}</style>
                    </div>
                  </div>
                  <div className="row plr--30 plr_sm--5">
                    <div className="col-lg-12">
                      <style>{`
                        @keyframes our-products-pulse {
                          0% { opacity: 1; }
                          50% { opacity: 0.4; }
                          100% { opacity: 1; }
                        }
                      `}</style>
                      {loading ? (
                        <div className="row g-4">
                          {Array.from({ length: 8 }, (_, i) => (
                            <ProductSkeleton key={i} />
                          ))}
                        </div>
                      ) : fetchError ? (
                        <p style={{ padding: "24px 0", color: "#c62828" }}>{fetchError}</p>
                      ) : products.length === 0 ? (
                        <p style={{ padding: "24px 0", color: "#666" }}>
                          {debouncedSearch || selectedCategory
                            ? "No products match your filters."
                            : "No products yet."}
                        </p>
                      ) : (
                        <div className="row g-4">
                          {products.map((post: any, index: number) => (
                            <div
                              key={String(post?._id ?? post?.productId ?? post?.slug ?? index)}
                              className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12"
                            >
                              <div className="single-shopping-card-one">
                                <WeeklyBestSellingMain
                                  Slug={shopProductPathSegment(post)}
                                  ProductImage={resolveProductListingImage(post)}
                                  ProductTitle={post.title}
                                  Price={post.price != null ? String(post.price) : ""}
                                  productQuantity={post.quantity}
                                  mrp={post?.mrp}
                                  discountPercentage={post?.discountPercentage}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default WeeklyBestSelling;
