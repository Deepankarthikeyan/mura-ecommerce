"use client";

import React, { useEffect, useState } from "react";
import ProductSmListMain from "@/components/product-main/ProductSmListMain";
import axios from "axios";
import { shopProductPathSegment } from "@/lib/productSlug";
import { resolveProductListingImage } from "@/lib/shopProductDisplay";
import {
  createDefaultRecommendations,
  type RecommendationsConfig,
} from "@/lib/homepageSections";

const DEFAULT_PROMO_IMAGE = "/assets/images/add/01.jpg";

type ProductRow = {
  title?: string;
  price?: string | number;
  mrp?: string | number;
  [key: string]: unknown;
};

const ProductSkeleton = () => (
  <div
    className="single-product-list"
    style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px 0" }}
  >
    <div
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: "#e0e0e0",
        borderRadius: "8px",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
    <div style={{ flex: 1 }}>
      <div
        style={{
          width: "80%",
          height: "16px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          marginBottom: "8px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "50%",
          height: "14px",
          backgroundColor: "#e0e0e0",
          borderRadius: "4px",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  </div>
);

const SectionSkeleton = ({ title }: { title: string }) => (
  <div className="feature-product-list-wrapper">
    <div className="title-area">
      <h2 className="title">{title}</h2>
    </div>
    {[1, 2, 3, 4].map((i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

function ProductColumn({ title, products }: { title: string; products: ProductRow[] }) {
  return (
    <div className="feature-product-list-wrapper">
      <div className="title-area">
        <h2 className="title">{title}</h2>
      </div>
      {products.map((post, index) => (
        <div key={`${shopProductPathSegment(post)}-${index}`} className="single-product-list">
          <ProductSmListMain
            Slug={shopProductPathSegment(post)}
            ProductImage={resolveProductListingImage(post)}
            ProductTitle={post.title}
            Price={post.price != null ? String(post.price) : ""}
            mrp={post.mrp}
          />
        </div>
      ))}
    </div>
  );
}

type RecentlyAddedProps = {
  config?: RecommendationsConfig;
  preview?: boolean;
};

function RecentlyAdded({ config, preview = false }: RecentlyAddedProps) {
  const settings = config ?? createDefaultRecommendations();
  const [recent, setRecent] = useState<ProductRow[]>([]);
  const [topRated, setTopRated] = useState<ProductRow[]>([]);
  const [topSelling, setTopSelling] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/products");
        const products: ProductRow[] = Array.isArray(response?.data?.body) ? response.data.body : [];
        const perCol = preview ? 3 : 4;
        if (cancelled) return;
        setRecent(products.slice(0, perCol));
        setTopRated(products.slice(perCol, perCol * 2));
        setTopSelling(products.slice(perCol * 2, perCol * 3));
      } catch {
        if (!cancelled) {
          setRecent([]);
          setTopRated([]);
          setTopSelling([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [preview]);

  const promoImage = settings.promoImageUrl || DEFAULT_PROMO_IMAGE;
  const ctaHref = settings.promoCtaLink || "/shop";

  return (
    <div>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>
      <div className={`four-feature-in-one rts-section-gapTop${preview ? " is-preview" : ""}`}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3">
              {isLoading ? (
                <SectionSkeleton title={settings.recentlyAddedTitle} />
              ) : (
                <ProductColumn title={settings.recentlyAddedTitle} products={recent} />
              )}
            </div>
            <div className="col-lg-3">
              {isLoading ? (
                <SectionSkeleton title={settings.topRatedTitle} />
              ) : (
                <ProductColumn title={settings.topRatedTitle} products={topRated} />
              )}
            </div>
            <div className="col-lg-3">
              {isLoading ? (
                <SectionSkeleton title={settings.topSellingTitle} />
              ) : (
                <ProductColumn title={settings.topSellingTitle} products={topSelling} />
              )}
            </div>
            <div className="col-lg-3">
              <div className="add-area-start-feature">
                <div className="thumbnail">
                  <img src={promoImage} alt={settings.promoTag || "Promotion"} />
                </div>
                <div className="inner-add-content">
                  {settings.promoTag.trim() ? <div className="tag">{settings.promoTag}</div> : null}
                  <h2 className="title">
                    {settings.promoHeadline}
                    {settings.promoHighlight.trim() ? <span>{settings.promoHighlight}</span> : null}
                  </h2>
                  {preview ? (
                    <span className="shop-now-goshop-btn">
                      <span className="text">{settings.promoCtaLabel}</span>
                      <div className="plus-icon">
                        <i className="fa-sharp fa-regular fa-plus" />
                      </div>
                      <div className="plus-icon">
                        <i className="fa-sharp fa-regular fa-plus" />
                      </div>
                    </span>
                  ) : (
                    <a href={ctaHref} className="shop-now-goshop-btn">
                      <span className="text">{settings.promoCtaLabel}</span>
                      <div className="plus-icon">
                        <i className="fa-sharp fa-regular fa-plus" />
                      </div>
                      <div className="plus-icon">
                        <i className="fa-sharp fa-regular fa-plus" />
                      </div>
                    </a>
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

export default RecentlyAdded;
