"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import HeaderOne from "@/components/header/Header";
import FooterOne from "@/components/Footer";
import HomeBannerGrid from "@/components/banner/HomeBannerGrid";
import MuraiProductCard from "@/components/murai/MuraiProductCard";
import HomePromoBanners from "@/components/home/HomePromoBanners";
import HomeNewsletter from "@/components/home/HomeNewsletter";
import ShortService from "@/components/service/ShortService";
import MuraiDiwaliBanner from "@/components/murai/MuraiDiwaliBanner";
import MuraiDealsSection from "@/components/murai/MuraiDealsSection";
import MuraiTestimonials from "@/components/murai/MuraiTestimonials";
import MuraiBlogSection from "@/components/murai/MuraiBlogSection";
import { useMuraiProducts } from "@/hooks/useMuraiProducts";
import { shopProductPathSegment } from "@/lib/productSlug";
import { resolveProductListingImage } from "@/lib/shopProductDisplay";

const HERO_SLIDES = ["slide-1", "slide-2", "slide-3"];

function ProductTabSection() {
  const { grouped, loading } = useMuraiProducts();
  const tabs = grouped.categoryTabs;
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (!activeTab && tabs[0]) setActiveTab(tabs[0].id);
  }, [tabs, activeTab]);

  const activeProducts = tabs.find((t) => t.id === activeTab)?.products ?? [];

  return (
    <section className="products-section">
      <div className="products-section-inner">
        <div className="section-heading"><h2>Sale Sarees</h2></div>
        <div className="product-tabs-wrap">
          <button className="product-tabs-arrow product-tabs-arrow--prev" type="button" aria-label="Previous category">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <div className="product-tabs" role="tablist" aria-label="Product categories">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`product-tab${activeTab === tab.id ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button className="product-tabs-arrow product-tabs-arrow--next" type="button" aria-label="Next category">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>

        {tabs.map((tab) => (
          <div key={tab.id} id={`tab-${tab.id}`} className={`tab-pane${activeTab === tab.id ? " active" : ""}`}>
            {activeTab === tab.id ? (
              <div className="suruchi-products-grid">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="suruchi-product" style={{ minHeight: 320, background: "#f3ece8" }} />
                  ))
                ) : (
                  activeProducts.map((post, index) => (
                    <MuraiProductCard
                      key={String(post?._id ?? post?.productId ?? index)}
                      slug={shopProductPathSegment(post)}
                      title={post.title ?? "Product"}
                      category={post.category}
                      image={resolveProductListingImage(post)}
                      price={post.price}
                      mrp={post.mrp}
                      discountPercentage={post.discountPercentage}
                    />
                  ))
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function BestsellerSection() {
  const { grouped, loading } = useMuraiProducts();
  return (
    <section className="bestseller-section">
      <div className="section-heading"><h2>Best Selling Sarees</h2></div>
      <div className="bestseller-grid suruchi-products-grid">
        {!loading &&
          grouped.bestseller.map((post, index) => (
            <MuraiProductCard
              key={String(post?._id ?? index)}
              slug={shopProductPathSegment(post)}
              title={post.title ?? "Product"}
              category={post.category}
              image={resolveProductListingImage(post)}
              price={post.price}
              mrp={post.mrp}
              discountPercentage={post.discountPercentage}
              showActions={false}
            />
          ))}
      </div>
    </section>
  );
}

export default function MuraiHomePage() {
  return (
    <div className="murai-home" data-page="home">
      <HeaderOne />
      <main>
        <section className="hero-slider">
          <Swiper
            modules={[Autoplay, EffectFade, Navigation]}
            className="hero-swiper"
            loop
            speed={700}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation
          >
            {HERO_SLIDES.map((slide) => (
              <SwiperSlide key={slide}>
                <div className={`hero-slide ${slide}`}>
                  <div className="hero-slide-content">
                    <p className="hero-slide-tag">Saree Sale</p>
                    <h2>
                      Handcrafted Silk
                      <br />
                      Sarees On Sale
                    </h2>
                    <p>
                      Up To 70% Off On Premium Sarees.
                      <br />
                      Silk, Cotton &amp; Designer Collection!
                    </p>
                    <Link href="/shop" className="btn btn-primary">
                      Shop Sale Sarees →
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <HomeBannerGrid />
        <ProductTabSection />
        <MuraiDealsSection />
        <BestsellerSection />
        <HomePromoBanners />
        <MuraiTestimonials />
        <MuraiDiwaliBanner />
        <MuraiBlogSection />
        <HomeNewsletter />
        <ShortService />
      </main>
      <FooterOne />
    </div>
  );
}
