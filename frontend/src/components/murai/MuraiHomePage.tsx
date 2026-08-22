"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";

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
import MuraiPageAttrs from "@/components/murai/MuraiPageAttrs";
import { useMuraiProducts } from "@/hooks/useMuraiProducts";
import { shopProductPathSegment } from "@/lib/productSlug";
import { resolveProductListingImage } from "@/lib/shopProductDisplay";

const HERO_SLIDES = ["slide-1", "slide-2", "slide-3"];

const PRODUCT_TABS = [
  { id: "tab-featured", label: "Silk Sarees" },
  { id: "tab-trending", label: "Cotton Sarees" },
  { id: "tab-newarrival", label: "Designer Sarees" },
] as const;

function ProductTabSection() {
  const { grouped, loading } = useMuraiProducts();
  const tabs = grouped.categoryTabs;
  const [activeTab, setActiveTab] = useState<string>(PRODUCT_TABS[0].id);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);

  const scrollStep = () => Math.max(120, Math.round((tabsListRef.current?.clientWidth || 240) * 0.65));

  const updateArrowState = () => {
    const list = tabsListRef.current;
    if (!list) return;
    const maxScroll = list.scrollWidth - list.clientWidth;
    setPrevDisabled(list.scrollLeft <= 4);
    setNextDisabled(list.scrollLeft >= maxScroll - 4);
  };

  const scrollTabs = (direction: number) => {
    tabsListRef.current?.scrollBy({ left: direction * scrollStep(), behavior: "smooth" });
  };

  const scrollTabIntoView = (tabId: string) => {
    const list = tabsListRef.current;
    const tab = list?.querySelector<HTMLButtonElement>(`[data-target="#${tabId}"]`);
    if (!list || !tab) return;
    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const offset = tabRect.left - listRect.left - (listRect.width - tabRect.width) / 2;
    list.scrollBy({ left: offset, behavior: "smooth" });
  };

  useEffect(() => {
    const list = tabsListRef.current;
    if (!list) return;
    updateArrowState();
    list.addEventListener("scroll", updateArrowState, { passive: true });
    window.addEventListener("resize", updateArrowState);
    return () => {
      list.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => scrollTabIntoView(activeTab));
    updateArrowState();
  }, [activeTab]);

  const activeProducts = tabs.find((t) => t.id === activeTab)?.products ?? [];

  return (
    <section className="products-section">
      <div className="products-section-inner">
        <div className="section-heading"><h2>Sale Sarees</h2></div>
        <div className="product-tabs-wrap">
          <button
            className="product-tabs-arrow product-tabs-arrow--prev"
            type="button"
            aria-label="Previous saree category"
            disabled={prevDisabled}
            onClick={() => scrollTabs(-1)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <div className="product-tabs" role="tablist" aria-label="Saree categories" ref={tabsListRef}>
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`product-tab${activeTab === tab.id ? " active" : ""}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                data-target={`#${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  scrollTabIntoView(tab.id);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            className="product-tabs-arrow product-tabs-arrow--next"
            type="button"
            aria-label="Next saree category"
            disabled={nextDisabled}
            onClick={() => scrollTabs(1)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>

        {PRODUCT_TABS.map((tab) => (
          <div key={tab.id} id={tab.id} className={`tab-pane${activeTab === tab.id ? " active" : ""}`}>
            {activeTab === tab.id ? (
              <div className="suruchi-products-grid">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="suruchi-product" style={{ minHeight: 320, background: "#f3ece8" }} />
                  ))
                ) : activeProducts.length > 0 ? (
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
                ) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <MuraiProductCard
                      key={i}
                      slug="shop"
                      title={["Banarasi Silk Saree", "Kanjivaram Silk Saree", "Cotton Handloom Saree", "Designer Party Wear"][i]}
                      category={tab.label}
                      image={`/assets/images/murai/sarees/${["banarasi", "kanjivaram", "paithani", "banarasi"][i]}.webp`}
                      price={[3599, 4299, 1899, 2799][i]}
                      mrp={[5999, 6999, 2999, 4499][i]}
                      discountPercentage={25}
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
  const products = grouped.bestseller.length > 0
    ? grouped.bestseller
    : [
        { title: "Banarasi Silk Saree", category: "Silk", price: 3599, mrp: 5999, discountPercentage: 25, image: "/assets/images/murai/sarees/banarasi.webp" },
        { title: "Kanjivaram Silk Saree", category: "Silk", price: 4299, mrp: 6999, discountPercentage: 30, image: "/assets/images/murai/sarees/kanjivaram.webp" },
        { title: "Paithani Silk Saree", category: "Silk", price: 3899, mrp: 5499, discountPercentage: 20, image: "/assets/images/murai/sarees/paithani.webp" },
        { title: "Cotton Handloom Saree", category: "Cotton", price: 1899, mrp: 2999, discountPercentage: 15, image: "/assets/images/murai/sarees/banarasi.webp" },
      ];

  return (
    <section className="bestseller-section">
      <div className="section-heading"><h2>Best Selling Sarees</h2></div>
      <div className="bestseller-grid suruchi-products-grid">
        {!loading &&
          products.map((post, index) => (
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
    <div className="murai-home">
      <MuraiPageAttrs page="home" />
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
