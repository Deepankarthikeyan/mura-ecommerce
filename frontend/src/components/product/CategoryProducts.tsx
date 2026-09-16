"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import WeeklyBestSellingMain from "@/components/product-main/WeeklyBestSellingMain";
import { shopProductPathSegment } from "@/lib/productSlug";
import { resolveProductListingImage } from "@/lib/shopProductDisplay";
import type { CategoryProductsConfig } from "@/lib/homepageSections";
import "./CategoryProducts.css";

type ProductRow = {
  _id?: string;
  productId?: string;
  slug?: string;
  urlSlug?: string;
  title?: string;
  category?: string;
  quantity?: string;
  price?: string | number;
  mrp?: string | number;
  discountPercentage?: string | number;
  image?: string;
  bannerImg?: string | string[];
};

type CategoryProductsProps = {
  config: CategoryProductsConfig;
  preview?: boolean;
};

export default function CategoryProducts({ config, preview = false }: CategoryProductsProps) {
  const tabs = config.categories;
  const [activeCategory, setActiveCategory] = useState(tabs[0] ?? "");
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tabs.includes(activeCategory)) {
      setActiveCategory(tabs[0] ?? "");
    }
  }, [tabs, activeCategory]);

  useEffect(() => {
    if (!activeCategory) {
      setProducts([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          category: activeCategory,
          limit: String(config.productLimit || 5),
        });
        const { data } = await axios.get<{ success?: boolean; message?: string; body?: ProductRow[] }>(
          `/api/products?${params.toString()}`,
        );
        if (cancelled) return;
        if (data?.success === false) {
          setError(data.message || "Failed to load products.");
          setProducts([]);
          return;
        }
        setProducts(Array.isArray(data?.body) ? data.body : []);
      } catch {
        if (!cancelled) {
          setError("Could not load products.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, config.productLimit]);

  const skeletonCount = Math.min(config.productLimit || 5, 5);

  return (
    <section className={`category-products-section${preview ? " is-preview" : ""}`}>
      <div className={preview ? undefined : "container"}>
        <h2 className="category-products-title">{config.title || "Sale Sarees"}</h2>

        {tabs.length > 0 ? (
          <ul className="category-products-tabs" role="tablist" aria-label="Product categories">
            {tabs.map((tab) => {
              const active = tab === activeCategory;
              return (
                <li key={tab}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`category-products-tab${active ? " is-active" : ""}`}
                    onClick={() => setActiveCategory(tab)}
                  >
                    {tab}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="category-products-empty">Select categories in the section editor to show product tabs.</p>
        )}

        {tabs.length === 0 ? null : loading ? (
          <div className="category-products-grid" aria-hidden="true">
            {Array.from({ length: skeletonCount }, (_, index) => (
              <div key={index} className="category-products-skeleton" />
            ))}
          </div>
        ) : error ? (
          <p className="category-products-empty">{error}</p>
        ) : products.length === 0 ? (
          <p className="category-products-empty">No products in this category yet.</p>
        ) : (
          <div className="category-products-grid">
            {products.map((product, index) => (
              <div
                key={String(product._id ?? product.productId ?? product.slug ?? index)}
                className="single-shopping-card-one"
              >
                <WeeklyBestSellingMain
                  Slug={shopProductPathSegment(product)}
                  ProductImage={resolveProductListingImage(product)}
                  ProductTitle={product.title}
                  Price={product.price != null ? String(product.price) : ""}
                  productQuantity={product.quantity}
                  mrp={product.mrp}
                  discountPercentage={product.discountPercentage}
                  ProductCategory={product.category}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
