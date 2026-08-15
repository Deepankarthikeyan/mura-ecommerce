"use client";
import HeaderOne from "@/components/header/Header";
import { useState, Suspense, useEffect } from 'react';
import WeeklyBestSellingMain from "@/components/product-main/WeeklyBestSellingMain";
// import ShopMainList from "./ShopMainList";
import FooterOne from "@/components/Footer";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import axios from "axios";
import { shopProductPathSegment } from "@/lib/productSlug";
import { resolveProductListingImage } from "@/lib/shopProductDisplay";

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

// Skeleton component for product cards
const ProductSkeleton = () => (
  <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
    <div className="single-shopping-card-one" style={{ padding: "20px" }}>
      <div style={{ width: "100%", height: "200px", backgroundColor: "#e0e0e0", borderRadius: "8px", marginBottom: "15px", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ width: "80%", height: "20px", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "10px", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ width: "60%", height: "16px", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "15px", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ width: "40%", height: "20px", backgroundColor: "#e0e0e0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
    </div>
  </div>
);

function ShopContent() {
  const [activeTab, setActiveTab] = useState<string>('tab1');
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch.trim());
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

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
      } catch (error) {
        console.error("Error fetching product categories:", error);
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
          setFetchError(typeof data?.message === "string" ? data.message : "Failed to fetch products. Please try again.");
          setProducts([]);
          return;
        }

        const fetchedProducts = Array.isArray(data?.body) ? data.body : [];
        setProducts(fetchedProducts);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        if (cancelled) return;
        if (error.response) {
          setFetchError(error.response.data?.message || "Failed to fetch products. Please try again.");
        } else if (error.request) {
          setFetchError("Network error. Please check your connection.");
        } else {
          setFetchError("An unexpected error occurred.");
        }
        setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, selectedCategory]);

  return (
    <div className="shop-page">
      {/* Breadcrumb */}
      <div className="rts-navigation-area-breadcrumb bg_light-1">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="navigator-breadcrumb-wrapper">
                <Link href="/">Home</Link>
                <i className="fa-regular fa-chevron-right" />
                <a className="current" href="#">Shop</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-seperator bg_light-1">
        <div className="container">
          <hr className="section-seperator" />
        </div>
      </div>

      <div className="shop-grid-sidebar-area rts-section-gap">
        <div className="container">
          <div className="row g-0">

            {/* <div className="col-xl-3 col-lg-12 pr--70 pr_lg--10 pr_sm--10 pr_md--5 rts-sticky-column-item">
              <div className="sidebar-filter-main theiaStickySidebar">

                <div className="single-filter-box">
                  <h5 className="title">Widget Price Filter</h5>
                  <div className="filterbox-body">
                    <form
                      action="#"
                      className="price-input-area"
                      onSubmit={handlePriceFilterSubmit}
                    >
                      <div className="half-input-wrapper">
                        <div className="single">
                          <label htmlFor="min">Min price</label>
                          <input
                            id="min"
                            type="number"
                            value={minPrice}
                            min={0}
                            onChange={handleMinPriceChange}
                          />
                        </div>
                        <div className="single">
                          <label htmlFor="max">Max price</label>
                          <input
                            id="max"
                            type="number"
                            value={maxPrice}
                            min={0}
                            onChange={handleMaxPriceChange}
                          />
                        </div>
                      </div>
                      <input
                        type="range"
                        className="range"
                        min={0}
                        max={1000}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                      />
                      <div className="filter-value-min-max">
                        <span>
                          Price: ${minPrice} — ${maxPrice}
                        </span>
                        <button type="submit" className="rts-btn btn-primary">
                          Filter
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="single-filter-box">
                  <h5 className="title">Product Categories</h5>
                  <div className="filterbox-body">
                    <div className="category-wrapper ">
                      {allCategories.map((cat, i) => (
                        <div className="single-category" key={i}>
                          <input
                            id={`cat${i + 1}`}
                            type="checkbox"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                          />
                          <label htmlFor={`cat${i + 1}`}>{cat}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="single-filter-box">
                  <h5 className="title">Select Brands</h5>
                  <div className="filterbox-body">
                    <div className="category-wrapper">
                      {allBrands.map((brand, i) => (
                        <div className="single-category" key={i}>
                          <input
                            id={`brand${i + 1}`}
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                          />
                          <label htmlFor={`brand${i + 1}`}>{brand}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div> */}

            <div className="col-xl-12 col-lg-12">
              <div className="filter-select-area">
                <div className="shop-products-toolbar">
                    <div className="shop-products-search">
                      <input
                        type="search"
                        className="shop-products-search-input"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search products"
                      />
                      <i className="fa-light fa-magnifying-glass" aria-hidden="true" />
                    </div>
                    <select
                      className="shop-products-category-select"
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
                <style>{`
                  .shop-page .filter-select-area {
                    background: transparent;
                    border-radius: 0;
                  }
                  .shop-products-toolbar {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 12px;
                    flex-wrap: nowrap;
                  }
                  .shop-products-search {
                    position: relative;
                    width: 220px;
                    flex: 0 0 auto;
                  }
                  .shop-products-search-input {
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
                  .shop-products-search-input:focus {
                    border-color: var(--color-primary);
                  }
                  .shop-products-search i {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #2c3c28;
                    pointer-events: none;
                  }
                  .shop-products-category-select {
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
                  .shop-products-category-select:focus {
                    border-color: var(--color-primary);
                  }
                  @media (max-width: 767px) {
                    .shop-products-search {
                      width: 160px;
                    }
                    .shop-products-category-select {
                      width: 150px;
                    }
                  }
                `}</style>
              </div>

              {/* Grid or List view */}
              <div className="tab-content" id="myTabContent">
                {/* Inject keyframes for skeleton animation */}
                <style>{`
                  @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                  }
                `}</style>
                <div className="product-area-wrapper-shopgrid-list mt--20 tab-pane fade show active">
                  {activeTab === 'tab1' && (
                    <div className="row g-4">
                      {isLoading ? (
                        // Show skeleton loaders while loading
                        <>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <ProductSkeleton key={i} />
                          ))}
                        </>
                      ) : fetchError ? (
                        // Show error message if fetch failed
                        <div className="col-12 text-center py-5">
                          <div style={{ color: "red", padding: "20px", backgroundColor: "#fee2e2", borderRadius: "8px" }}>
                            <h4>Error Loading Products</h4>
                            <p>{fetchError}</p>
                            <button
                              onClick={() => window.location.reload()}
                              className="rts-btn btn-primary mt-3"
                            >
                              Retry
                            </button>
                          </div>
                        </div>
                      ) : products.length > 0 ? (
                        products.map((post: any, index: number) => (
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
                        ))
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h2>
                            {debouncedSearch || selectedCategory
                              ? "No products match your filters."
                              : "No Product Found"}
                          </h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="product-area-wrapper-shopgrid-list with-list mt--20">
                  {activeTab === 'tab2' && (
                    <div className="row">
                      {isLoading ? (
                        // Show skeleton loaders while loading
                        <>
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="col-lg-6">
                              <div className="single-shopping-card-one discount-offer" style={{ padding: "20px", marginBottom: "20px" }}>
                                <div style={{ display: "flex", gap: "20px" }}>
                                  <div style={{ width: "200px", height: "150px", backgroundColor: "#e0e0e0", borderRadius: "8px", animation: "pulse 1.5s ease-in-out infinite" }} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ width: "80%", height: "20px", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "10px", animation: "pulse 1.5s ease-in-out infinite" }} />
                                    <div style={{ width: "60%", height: "16px", backgroundColor: "#e0e0e0", borderRadius: "4px", marginBottom: "10px", animation: "pulse 1.5s ease-in-out infinite" }} />
                                    <div style={{ width: "40%", height: "20px", backgroundColor: "#e0e0e0", borderRadius: "4px", animation: "pulse 1.5s ease-in-out infinite" }} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : fetchError ? (
                        // Show error message if fetch failed
                        <div className="col-12 text-center py-5">
                          <div style={{ color: "red", padding: "20px", backgroundColor: "#fee2e2", borderRadius: "8px" }}>
                            <h4>Error Loading Products</h4>
                            <p>{fetchError}</p>
                            <button
                              onClick={() => window.location.reload()}
                              className="rts-btn btn-primary mt-3"
                            >
                              Retry
                            </button>
                          </div>
                        </div>
                      ) : products.length > 0 ? (
                        products.map((post: any, index: number) => (
                          <div key={index} className="col-lg-6">
                            <div className="single-shopping-card-one discount-offer">
                              {/* <ShopMainList
                                Slug={shopProductPathSegment(post)}
                                ProductImage={resolveProductListingImage(post)}
                                ProductTitle={post.title}
                                Price={post.price}
                                mrp={post.mrp}
                                discountPercentage={post.discountPercentage}
                                productQuantity={
                                  post.quantity != null && post.quantity !== ""
                                    ? String(post.quantity)
                                    : undefined
                                }
                              /> */}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-12 text-center py-5">
                          <h2>
                            {debouncedSearch || selectedCategory
                              ? "No products match your filters."
                              : "No Product Found"}
                          </h2>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <HeaderOne />
      <Suspense fallback={<div>Loading...</div>}>
        <ShopContent />
      </Suspense>
      <FooterOne />
    </div>
  );
}